import SteamID from "steamid";
import LogError from "../../../classes/errors/base/LogError";
import tryy from "../../tryy/tryy";
import { getUserInventoryContentsWaitOnFailConstant } from "../../../shared-network/constants/steam/wait-before-retry/getUserInventoryContentsWaitOnFailConstant";
import { SteamId64 } from "../../../models/types/SteamId64";
import XMLParsedProfileModel from "../../../models/models/steam/steam-profiles/XMLParsedProfileModel";
import { getSteamUserWaitOnFailConstant } from "../../../shared-network/constants/steam/wait-before-retry/getSteamUserWaitOnFailConstant";
import { PromisifiedSteamCommunity } from "../../../models/types/PromisifiedCommunity";
import SteamInventoryModel from "../../../models/models/steam/steam-items/SteamInventoryModel";
import createParsedItem from "../../../factories/createParsedItem";
import RecordFunctions from "../../../classes/RecordFunctions";
import TryyError from "../../../classes/errors/TryyError";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import g_steamCookies from "../../../steam-client/steam-login/user/config/g_steamCookies";
import wait from "../../wait";
import { EInventoryGetStatus } from "../../../models/enums/EInventoryGetStatus";
import { TradeOffer } from "../../../declarations/steam-tradeoffer-manager/TradeOffer";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import g_offerIds from "../../../steam-client/globals/g_offerIds";
import g_clientsIdentitySecrets from "../../../steam-client/globals/g_clientsIdentitySecrets";
import log from "../../../classes/logger/Log";
import StackTrace from "../../../classes/errors/StackTrace";
import CriticalLogError from "../../../classes/errors/base/CriticalLogError";
import g_steamInstancesStores from "../../../steam-client/globals/g_steamInstancesStores";
import SteamTotp from "steam-totp";
import SteamCommunity from "steamcommunity";
import promisifySteamCommunity from "../../promisify/promisifySteamCommunity";
import { assert } from "console";

/**
 * Maps the error coming from doctor mckay module to enum.
 * @export
 * @param {string} error
 * @returns {EInventoryGetStatus}
 */
export function getUserInventoryContentsErrorToEnumMap(error: string): EInventoryGetStatus {
  if (error === "Private inventory") {
    return EInventoryGetStatus.PrivateInventory;
  }
  if (error === "Private profile") {
    return EInventoryGetStatus.PrivateProfile;
  }
  if (error === "Malformed response") {
    return EInventoryGetStatus.MalformedResponse;
  }

  if (error.includes("This profile is private")) {
    return EInventoryGetStatus.PrivateProfile;
  }

  return EInventoryGetStatus.OtherError;
}
/**
 * Static methods which depends on a static community which you need to set.
 * @export
 * @class CSteamCommunityFunctions
 */
export default class SteamCommunityFunctions {
  constructor(clientId: null, ip?: string);
  constructor(clientId: SteamId64);
  constructor(firstParam: SteamId64 | null, ip?: string) {
    if (!firstParam) {
      const options: any = {};

      if (ip) options.localAddress = ip;

      const community = new SteamCommunity(options);

      this.community = promisifySteamCommunity(community);
      this.clientId = "no client id";
    } else {
      firstParam = firstParam as SteamId64;
      const store = g_steamInstancesStores[firstParam];

      if (!store) {
        throw new LogError(`Store for client ${firstParam} is not found`);
      }
      this.clientId = firstParam;
      this.community = store.community;
    }
  }
  private community: PromisifiedSteamCommunity;
  public clientId: SteamId64;
  async getInventory(
    partnerId: string | SteamID,
    appId: number,
    contextId: number,
    tradableOnly: boolean,
    maxRetries: number
  ): Promise<SteamInventoryModel> {
    if (!this.community) {
      throw new LogError("community is not set");
    }

    return new Promise<SteamInventoryModel>(async (resolve) => {
      tryy(
        {
          maxRetries: maxRetries,
          waitOnFail: getUserInventoryContentsWaitOnFailConstant,
        },
        async (options) => {
          await this.community
            .getUserInventoryContents(partnerId, appId, contextId, tradableOnly)
            .then((items) => {
              resolve({
                items: items.map(createParsedItem),
                getStatus: EInventoryGetStatus.Ok,
              });
            })
            .catch((error) => {
              const errorType = getUserInventoryContentsErrorToEnumMap(error.message);
              if (errorType !== EInventoryGetStatus.OtherError) {
                resolve({ items: [], getStatus: errorType });
                return;
              }
              // continue with trying
              throw new Error(error);
            });
        }
      ).catch((error: TryyError) => {
        // max retries exceeded
        const errorMessage = error.errors.map((e) => e.message).join("\n");
        resolve({ items: [], getStatus: EInventoryGetStatus.OtherError, errorMessage: errorMessage });
      });
    });
  }
  /**
   * Enables to retry n number of times before giving up
   * @static
   * @param {(SteamID | SteamId64)} partnerId
   * @param {number} maxRetries
   * @returns {Promise<XMLParsedProfileModel>}
   * @memberof CSteamCommunityFunctions
   */
  async getXMLParsedProfile(partnerId: SteamId64, maxRetries: number): Promise<XMLParsedProfileModel> {
    if (!this.community) {
      throw new LogError("community is not set");
    }

    return new Promise((resolve) => {
      tryy(
        {
          maxRetries: maxRetries,
          waitOnFail: getSteamUserWaitOnFailConstant,
        },
        async () => {
          resolve(await this.community.getSteamUser(new SteamID(partnerId)));
        }
      );
    });
  }
  getMyInventory = async (): Promise<ParsedItemModel[]> => {
    const { clientId, community } = this;

    // shortpolling the cookies so we know when they are set
    let iterations = 0;
    const loop = async (): Promise<ParsedItemModel[]> => {
      if (g_steamCookies[clientId]?.getValue()) {
        if (iterations > 5) {
          throw new CriticalLogError(`Getting client inventory iterated more than 5 times. Client id ${clientId}`);
        }
        iterations++;
        const result = await this.getInventory(clientId, 730, 2, true, 10);
        if (result.getStatus !== EInventoryGetStatus.Ok) {
          log.error(new StackTrace(), `Retrieving to get our inventory with client id ${clientId}, additional message:\n${result.errorMessage}`);
          return await loop();
        }

        return (await this.getInventory(clientId, 730, 2, false, 10)).items;
      } else {
        await wait(100);
        return await loop();
      }
    };
    const items = await loop();
    return items;
  };
  confirmOffer = async (offer: TradeOffer) => {
    const { clientId, community } = this;

    assert(clientId);
    if (offer.state === ETradeOfferState.CreatedNeedsConfirmation) {
      console.log("it needs confirmation");
      if (!g_offerIds.has(offer.id)) {
        console.log("ERROR: offer is not cached");
        log.critical([`WATCHOUT, offer with id ${offer.id} needs confirmation, but it wasn't created from the application,offer object`, offer]);
        return;
      }
      console.log("trying to confirm it");
      await tryy(
        {
          maxRetries: 5,
          waitOnFail: 2000,
        },
        () =>
          new Promise((resolve, reject) => {
            const secret = g_clientsIdentitySecrets[clientId];

            if (!secret) {
              throw new LogError(`No secret found for client id ${clientId}`);
            }
            community.acceptConfirmationForObject(secret, offer.id, (error) => {
              if (error) {
                console.log("Error accept offer", JSON.stringify(error));
                reject(error);
              } else {
                console.log("successfully accepted offer");
                resolve();
              }
            });
          })
      );
    }
  };
  acceptAllConfirmations() {
    return tryy({ maxRetries: 5, waitOnFail: 10000 }, () => {
      const time = Math.floor(Date.now() / 1000);
      const confKey = SteamTotp.getConfirmationKey(g_clientsIdentitySecrets[this.clientId], time, "conf");
      const allowKey = SteamTotp.getConfirmationKey(g_clientsIdentitySecrets[this.clientId], time, "allow");
      return this.community.acceptAllConfirmations(time, confKey, allowKey);
    });
  }
}

import TradeOfferManager, { ETradeOfferState } from "steam-tradeoffer-manager";
import { TradeOffer } from "../../../declarations/steam-tradeoffer-manager/TradeOffer";
import tryy from "../../tryy/tryy";
import TRADE_OFFER_SENDING_MAX_RETRIES from "../../../shared-network/constants/steam/max-retries/TRADE_OFFER_SENDING_MAX_RETRIES";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import TradeOfferModel from "../../../models/models/steam/steam-offers/TradeOfferModel";
import log from "../../../classes/logger/Log";
import MAX_MONGO_DB_RETRIES from "../../../data/constants/MAX_MONGO_DB_RETRIES";
import MONGO_DB_WAIT_ON_FAIL from "../../../data/constants/MONGO_DB_WAIT_ON_FAIL";
import { SteamId64 } from "../../../models/types/SteamId64";
import SENDING_OFFER_WAIT_ON_FAIL from "../../../shared-network/constants/steam/wait-before-retry/SENDING_OFFER_WAIT_ON_FAIL";
import UserTradingInformationModel from "../../../models/models/steam/steam-offers/UserTradingInformationModel";
import g_offerIds from "../../../steam-client/globals/g_offerIds";
import SteamCommunityFunctions from "../steam-community/SteamCommunityFunctions";
import handleSteamOfferChanged from "../../../steam-client/functions/event-handlers/handleSteamOfferChanged";
import g_steamInstancesStores from "../../../steam-client/globals/g_steamInstancesStores";
import LogError from "../../../classes/errors/base/LogError";
import main_handleSteamOfferChanged from "../../../main-server/src/functions/childs/router-related/main_handleSteamOfferChanged";

export default class SteamTradeOfferManagerFunctions {
  constructor(public clientId: SteamId64) {
    const store = g_steamInstancesStores[clientId];
    if (!store) {
      throw new LogError(`Store for client id ${clientId} is not found`);
    }
    this.manager = store.manager;
  }
  private manager: TradeOfferManager;

  createOffer(tradeOfferLink: string): TradeOffer;
  createOffer(partnerId: SteamId64) {
    return this.manager.createOffer(partnerId);
  }

  async getUserTradeInformation(partnerId: SteamId64): Promise<UserTradingInformationModel> {
    const dummyOffer = this.createOffer(partnerId);
    const info: UserTradingInformationModel = await tryy(
      { maxRetries: 5, waitOnFail: 3000 },
      ({ cancel }) =>
        new Promise<UserTradingInformationModel>((resolve, reject) => {
          dummyOffer.getUserDetails((error, me, them) => {
            if (error) {
              const { message } = error;
              if (message.startsWith("HTTP error ")) {
                reject(error);
              } else {
                cancel(`Met error which is not http related`);
                reject(error);
              }
              return;
            }
            const info: UserTradingInformationModel = {
              escrowDays: them?.escrowDays ?? 999,
              canTrade: true,
            };
            resolve(info);
          });
        })
    ).catch((error) => {
      log.do(["Catched error when getting trade info details, filling with default values, error:", error]);
      return { canTrade: false };
    });

    return info;
  }
  sendOffer = async (offer: TradeOffer, madeByWorker: string, community: SteamCommunityFunctions, isMaintanceOffer: boolean, message?: string): Promise<void> => {
    const db = new DbServiceBase<TradeOfferModel>(EMongoDbCollectionNames.TradeOffers);
    const partnerId = offer.partner.getSteamID64();
    const entity: Partial<TradeOfferModel> = {
      clientId: this.clientId,
      partnerId: offer.partner.getSteamID64(),
      state: ETradeOfferState.JustCreated,
      madeByWorker: madeByWorker,
      madeOn: new Date(),
      isMaintanceOffer,
    };

    message && (entity.message = message);

    await tryy(
      { maxRetries: TRADE_OFFER_SENDING_MAX_RETRIES, timeout: SENDING_OFFER_WAIT_ON_FAIL },
      (options) =>
        new Promise((resolve) => {
          offer.send(async (error) => {
            if (error) {
              console.log("ERROR MET", JSON.stringify(error));
              options.cancel("some error met");
              return;
            }
            // keeping track of which offers are created from here
            g_offerIds.add(offer.id);
            community.confirmOffer(offer).then(() => main_handleSteamOfferChanged(this.clientId, partnerId, offer.id, ETradeOfferState.JustCreated));

            entity._id = offer.id;
            entity.actedOn = new Date();
            entity.itemsToGive = [];
            entity.itemsToReceive = [];
            entity.profit = 0;

            await tryy({ maxRetries: MAX_MONGO_DB_RETRIES, waitOnFail: MONGO_DB_WAIT_ON_FAIL }, async () => {
              await db.insertOne(entity as never);
            })
              .then(resolve)
              .catch((error) => {
                log.error(error, ["Couldn't insert offer to the database, the offer is sent, but we cannot track it, entity that failed to insert:", entity]);
                options.cancel("Couldn't insert offer to the database, the offer is sent, but we cannot track it");
              });
          });
        })
    );
  };
}

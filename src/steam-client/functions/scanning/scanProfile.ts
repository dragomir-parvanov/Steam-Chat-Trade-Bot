import { SteamId64 } from "../../../models/types/SteamId64";
import SteamCommunityFunctions from "../../../functions/steam/steam-community/SteamCommunityFunctions";
import SteamUserFunctions from "../../../functions/steam/steam-user/SteamUserFunctions";
import CLIENT_ADMINS from "../../config/CLIENT_ADMINS";
import PartnerScanningDbService from "../../../data/services/PartnerScanningDbService";
import createParsedItemInventoryWithSellInformationModel from "../../../factories/mongo/createParsedItemWithSellInformationModel";
import ActiveChatModel from "../../../models/ActiveChatModel";
import { EActiveChatTriggerAction } from "../../../models/enums/EActiveChatTriggerAction";
import SteamTradeOfferManagerFunctions from "../../../functions/steam/steam-trade-offer-manager/SteamTradeOfferManagerFunctions";
import { EInventoryGetStatus } from "../../../models/enums/EInventoryGetStatus";
import { EPersonaState } from "../../../declarations/steam-user/EPersonaState";
import g_activeChats from "../../../shared-network/globals/observables/chat-related/g_activeChats";
import createDoubleIdentification from "../../../functions/doubleIdentification";
import UpdatingSubject from "../../../classes/rxjs-extending/UpdatingSubject";
import g_currentlyScannedProfiles from "../../globals/g_currentlyScannedProfiles";
import g_steamInstancesStores from "../../globals/g_steamInstancesStores";
import LogError from "../../../classes/errors/base/LogError";
import o_newChats from "../../../shared-network/globals/observables/chat-related/o_newChats";

/**
 * Scanning a steam profile.
 * If the profile meets some criterias, it will be sent to the main server as an active chat.
 * @export
 * @param {SteamId64} partnerId
 * @returns {Promise<void>}
 */
export default async function scanProfile(clientId: SteamId64, partnerId: SteamId64, shouldIgnoreCurrentlyScannedCheck?: boolean): Promise<void> {
  if (CLIENT_ADMINS.some((id) => id === partnerId)) {
    return;
  }
  if (!shouldIgnoreCurrentlyScannedCheck && g_currentlyScannedProfiles.has(partnerId)) {
    return;
  }
  try {
    const db = new PartnerScanningDbService();
    const userFunctions = new SteamUserFunctions(clientId);
    const communityFunctions = new SteamCommunityFunctions(clientId);
    const managerFunctions = new SteamTradeOfferManagerFunctions(clientId);
    const profile = await communityFunctions.getXMLParsedProfile(partnerId, 5);

    if (!profile.isLimitedAccount) {
      if (process.env.NODE_ENV === "production") {
        await userFunctions.removeFriend(partnerId, true);
      }

      return;
    }

    const tradingInformation = await managerFunctions.getUserTradeInformation(partnerId);

    if (!tradingInformation.canTrade) {
      return await db.rescanAfterDays(partnerId, 7);
    }

    const inventory = await communityFunctions.getInventory(partnerId, 730, 2, false, 5);

    if (inventory.getStatus === EInventoryGetStatus.PrivateProfile || inventory.getStatus === EInventoryGetStatus.PrivateInventory) {
      return await db.rescanAfterDays(partnerId, 10);
    }

    if (inventory.getStatus === EInventoryGetStatus.MalformedResponse || inventory.getStatus === EInventoryGetStatus.OtherError) {
      return await db.rescanAfterDays(partnerId, 1);
    }

    const tradableItems = inventory.items.filter((i) => i.isTradable);

    const itemsWithSellInformation = await createParsedItemInventoryWithSellInformationModel(tradableItems);

    async function sendToMainServer() {
      const chat: ActiveChatModel = {
        tradingInformation,
        partnerProfile: profile,
        clientId,
        partnerId,
        isActive: true,
        addedOn: new Date(),
        triggerAction: EActiveChatTriggerAction.Scanning,
        partnerInventory: inventory,
        personaState: g_steamInstancesStores[clientId].client.users[partnerId]?.persona_state ?? EPersonaState.Offline,
        stateMessage: "not implemented",
      };
      o_newChats.next(chat);
    }

    const highestValueItem = itemsWithSellInformation.reduce<number>((prevValue, { averagePrice }) => {
      if (averagePrice > prevValue) {
        return averagePrice;
      } else {
        return prevValue;
      }
    }, 0);

    if (highestValueItem > 0.17) {
      return await sendToMainServer();
    }

    const totalInventorySum = itemsWithSellInformation.reduce<number>((acc, i) => acc + i.averagePrice, 0);

    if (totalInventorySum > 0.4) {
      return await sendToMainServer();
    }

    await db.rescanAfterDays(partnerId, 1);
  } catch (error) {
    throw new LogError(`Error while scanning ${partnerId}, error message ${error.message}`);
  } finally {
    g_currentlyScannedProfiles.delete(partnerId);
  }
}

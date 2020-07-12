import { TradeOffer } from "../../../declarations/steam-tradeoffer-manager/TradeOffer";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import g_clientsInventories from "../../../shared-network/globals/observables/chat-related/g_clientsInventories";
import { SteamId64 } from "../../../models/types/SteamId64";
import g_activeChats from "../../../shared-network/globals/observables/chat-related/g_activeChats";
import createParsedItem from "../../../factories/createParsedItem";
import createDoubleIdentification from "../../../functions/doubleIdentification";
import _ from "lodash";
import SteamInventoryModel from "../../../models/models/steam/steam-items/SteamInventoryModel";
import { EInventoryGetStatus } from "../../../models/enums/EInventoryGetStatus";
import o_newClientInventory from "../../../shared-network/globals/observables/chat-related/o_newClientInventory";
import o_chatUpdate from "../../../shared-network/globals/observables/chat-related/o_chatUpdate";
import executionTimestamp from "../../../functions/executionTimestamp";

/**
 * Handles the inventories changes when someone accepts items.
 * So we dont poll the steam api every time an offer status changes.
 * @param offer
 * @param clientId
 */
export default async function handleSteamOfferInventoriesChange(offer: TradeOffer, clientId: SteamId64) {
  if (offer.updated < executionTimestamp) {
    // no need to update the inventory, when the offer was updated before the execution time
    // because we already got the up to date inventory.
    return;
  }
  const partnerId = offer.partner.getSteamID64();
  const id = createDoubleIdentification(clientId, partnerId);
  switch (offer.state) {
    case ETradeOfferState.InEscrow:
      {
        const clientInventory = g_clientsInventories[clientId];
        if (clientInventory) {
          const newInventory = clientInventory.filter((i) => !offer.itemsToGive.some((i2) => i.assetId === i2.id));
          o_newClientInventory.next({ clientId, data: newInventory });
        }
        const newPartnerInventory = g_activeChats?.[id]?.partnerInventory;
        if (newPartnerInventory) {
          newPartnerInventory.items = newPartnerInventory.items.filter((i) => !offer.itemsToReceive.some((i2) => i.assetId === i2.id));
          o_chatUpdate.next({ clientId, partnerId, partnerInventory: newPartnerInventory });
        }
      }
      break;
    case ETradeOfferState.Accepted:
      {
        // simulating the trade
        // we give our items and make them untradable
        // they give us their items and make them untradable
        const clientInventory = g_clientsInventories[clientId];
        const [clientItemsInTrade, clientInventoryLeft] = _.partition(clientInventory, (i) => offer.itemsToGive.some((i2) => i.assetId === i2.id));

        const partnerInventory = g_activeChats?.[id]?.partnerInventory?.items ?? [];
        const [partnerItemsInTrade, partnerItemsLeft] = _.partition(partnerInventory, (i) => offer.itemsToReceive.some((i2) => i.assetId === i2.id));
        clientItemsInTrade.forEach((i) => (i.isTradable = false));
        partnerItemsInTrade.forEach((i) => (i.isTradable = false));
        const newClientInventory = [...partnerItemsInTrade, ...clientInventoryLeft];
        const newPartnerInventory: SteamInventoryModel = { items: [...clientItemsInTrade, ...partnerItemsLeft], getStatus: EInventoryGetStatus.Ok };
        o_chatUpdate.next({ clientId, partnerId, partnerInventory: newPartnerInventory });
        o_newClientInventory.next({ clientId, data: newClientInventory });
      }
      break;
    case ETradeOfferState.Canceled:
      {
        const clientInventory = g_clientsInventories[clientId];
        if (clientInventory) {
          clientInventory.push(...offer.itemsToReceive.map(createParsedItem));
          o_newClientInventory.next({ clientId, data: clientInventory });
        }

        const newPartnerInventory = g_activeChats?.[id]?.partnerInventory;
        if (newPartnerInventory) {
          newPartnerInventory.items.push(...offer.itemsToReceive.map(createParsedItem));
          o_chatUpdate.next({ clientId, partnerId, partnerInventory: newPartnerInventory, tradingInformation: { canTrade: false } });
        }
      }
      break;
  }
}

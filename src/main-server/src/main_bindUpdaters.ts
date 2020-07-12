import o_chatUpdate from "../../shared-network/globals/observables/chat-related/o_chatUpdate";
import createDoubleIdentification from "../../functions/doubleIdentification";
import g_activeChats from "../../shared-network/globals/observables/chat-related/g_activeChats";
import o_newClientInventory from "../../shared-network/globals/observables/chat-related/o_newClientInventory";
import g_clientsInventories from "../../shared-network/globals/observables/chat-related/g_clientsInventories";
import UpdatingSubject from "../../classes/rxjs-extending/UpdatingSubject";
import LogError from "../../classes/errors/base/LogError";
import o_newChats from "../../shared-network/globals/observables/chat-related/o_newChats";
import log from "../../classes/logger/Log";
import StackTrace from "../../classes/errors/StackTrace";
import g_clientWorkersInformation from "./globals/g_clientWorkersInformation";
import sellItemsInClientInventoryFromSellOrder from "../../steam-client/functions/market/sellItemsInClientInventoryFromSellOrder";
import g_marketSellOrders from "./globals/g_marketSellOrders";
import g_marketStatus from "./globals/g_marketStatus";

/**
 * Updating main server globals from clients
 */
export default function main_bindUpdaters() {
  o_chatUpdate.subscribe({
    next: (u) => {
      const id = createDoubleIdentification(u.clientId, u.partnerId);
      const subject = g_activeChats[id];
      if (!subject) {
        log.error(new StackTrace(), `Chat with id ${id} is not found to be updated`);
        return;
      }
      if (g_activeChats[id]) {
        Object.assign(g_activeChats[id], u);
      }
    },
  });
  o_newClientInventory.subscribe({
    next: (inv) => {
      g_clientsInventories[inv.clientId] = inv.data;
    },
  });
  o_newChats.subscribe({
    next: (c) => {
      const id = createDoubleIdentification(c.clientId, c.partnerId);
      g_activeChats[id] = c;
    },
  });

  o_newClientInventory.subscribe({
    next: (inv) => {
      //handle selling on market
      if (!g_marketStatus.isMarketAutoSellOn) {
        return;
      }

      const client = g_clientWorkersInformation[inv.clientId];
      if (!client) {
        throw new LogError(`Client with id ${inv.clientId} is not found`);
      }

      // dont wan't to crash the whole applicatoin if we await this
      sellItemsInClientInventoryFromSellOrder(inv.clientId, inv.data, g_marketSellOrders, client.walletCurrency).then((r) => {
        r(inv.clientId, g_clientsInventories[inv.clientId]);
      });
    },
  });
}

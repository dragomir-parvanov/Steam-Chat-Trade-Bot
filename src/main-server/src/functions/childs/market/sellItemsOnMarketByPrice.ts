import MarketSellOrderModel from "../../../../../models/models/steam/steam-market/MarketSellOrderModel";
import g_clientWorkersInformation from "../../../globals/g_clientWorkersInformation";
import RecordFunctions from "../../../../../classes/RecordFunctions";
import g_clientsInventories from "../../../../../shared-network/globals/observables/chat-related/g_clientsInventories";
import _ from "lodash";
import sellItemsInClientInventoryFromSellOrder from "../../../../../steam-client/functions/market/sellItemsInClientInventoryFromSellOrder";
import LogError from "../../../../../classes/errors/base/LogError";
import g_marketSellOrders from "../../../globals/g_marketSellOrders";

export default async function sellItemsOnMarketByPrice(orders: Record<string, MarketSellOrderModel>) {
  const runningClients = Object.values(g_clientWorkersInformation).filter((c) => c.isRunning);
  const orderValues = Object.values(orders).filter((o) => o.isActive);
  const inventoriesThatHaveSomeItemThatNeedToBeSold = RecordFunctions.filter(g_clientsInventories, (inv) => {
    const haveSomeItem = inv.some((i) => orderValues.some((i2) => i.marketHashName === i2._id));

    return haveSomeItem;
  });

  const clientIdsThatNeedToBeScanned = Object.keys(inventoriesThatHaveSomeItemThatNeedToBeSold);

  const clientsThatNeedToBeScanned = runningClients.filter((c) => clientIdsThatNeedToBeScanned.some((c2) => c._id === c2));

  // grouping the accounts in ip groups, so we don't flood steam with requests

  const groupedClients = _.chain(clientsThatNeedToBeScanned).groupBy("publicIp").value();

  const promises = RecordFunctions.map(groupedClients, async (clients) => {
    for (const client of clients) {
      const inventory = g_clientsInventories[client._id];
      if (!inventory) {
        throw new LogError(`Client inventory for id ${client._id} is not found`);
      }
      const result = await sellItemsInClientInventoryFromSellOrder(client._id, inventory, g_marketSellOrders, client.walletCurrency);
      result(client._id, g_clientsInventories[client._id]);
    }
  });

  return await Promise.all(Object.values(promises));
}

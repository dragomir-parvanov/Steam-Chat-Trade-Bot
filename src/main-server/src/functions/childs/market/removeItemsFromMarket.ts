import MarketSellListingsModel from "../../../../../models/models/steam/steam-market/MarketSellListingsModel";
import g_clientWorkersInformation from "../../../globals/g_clientWorkersInformation";
import _ from "lodash";
import RecordFunctions from "../../../../../classes/RecordFunctions";
import g_steamInstancesStores from "../../../../../steam-client/globals/g_steamInstancesStores";
import log from "../../../../../classes/logger/Log";
import StackTrace from "../../../../../classes/errors/StackTrace";
import getMarketListingsAPIModel from "../../../../../steam-client/functions/market/getMarketListingsAPIModel";
import GetMarketListingsSteamAPIModel from "../../../../../models/models/steam/steam-market/steamAPI/GetMarketListingsSteamAPIModel";
import parseMarketListingPage from "../../../../../functions/steam/steam-market/parseMarketListingPage";
import { ECurrency } from "../../../../../models/enums/ECurrency";
import removeListingFromMarket from "../../../../../steam-client/functions/market/removeListingFromMarket";
import wait from "../../../../../functions/wait";
import AssetId from "../../../../../models/types/AssetId";
import g_clientsInventories from "../../../../../shared-network/globals/observables/chat-related/g_clientsInventories";
import o_newClientInventory from "../../../../../shared-network/globals/observables/chat-related/o_newClientInventory";
import ParsedItemOnMarket from "../../../../../models/models/steam/steam-market/ParsedItemOnMarket";

export default async function removeItemsFromMarket(batch: MarketSellListingsModel) {
  const clients = Object.values(g_clientWorkersInformation).filter((c) => c.isRunning);
  const groupedClients = _.groupBy(clients, "publicIp");
  const promises = RecordFunctions.map(groupedClients, async (clients) => {
    for (const client of clients) {
      const currency = (ECurrency[client.walletCurrency] as never) as keyof typeof ECurrency;
      const community = g_steamInstancesStores[client._id]?.community;
      if (!community) {
        log.error(new StackTrace(), `community for ${client._id} is not found`);
        continue;
      }

      let start = 0;
      const removedItems = new Set<ParsedItemOnMarket>();
      while (true) {
        let count = 0;
        let marketListings: GetMarketListingsSteamAPIModel;
        await getMarketListingsAPIModel(community, start)
          .then((r) => (marketListings = r))
          .catch((e) => log.error(e, `Cannot get listings from partner with id ${client._id}`));

        if (typeof marketListings! === "undefined") {
          break;
        }

        const parsedListings = parseMarketListingPage(marketListings);

        for (const item of parsedListings) {
          if (batch[currency].some((order) => order.marketHashName === item.marketHashName && order.price === item.marketPrice)) {
            await removeListingFromMarket(community, item.marketListingId)
              .then(() => {
                count++;
                removedItems.add(item);
              })
              .catch((err) =>
                log.error(
                  err,
                  `Cannot remove item with market hash name ${item.marketHashName} listing id ${item.marketListingId} from the market
                  \n client id ${client._id}`
                )
              );
            await wait(3000);
          }
        }

        if (parsedListings.length < 100) {
          break;
        }

        // adjusting the offset from the items that are removed
        start += 100 - count;

        await wait(5000);
      }

      const clientInventory = g_clientsInventories[client._id];

      const newInventory = [...clientInventory, ...removedItems];

      o_newClientInventory.next({ clientId: client._id, data: newInventory });
    }
  });

  await Promise.all(Object.values(promises));
}

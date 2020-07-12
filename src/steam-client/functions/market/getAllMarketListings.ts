import _ from "lodash";
import StackTrace from "../../../classes/errors/StackTrace";
import log from "../../../classes/logger/Log";
import RecordFunctions from "../../../classes/RecordFunctions";
import parseMarketListingPage from "../../../functions/steam/steam-market/parseMarketListingPage";
import g_clientWorkersInformation from "../../../main-server/src/globals/g_clientWorkersInformation";
import { ECurrency } from "../../../models/enums/ECurrency";
import MarketSellListingsModel from "../../../models/models/steam/steam-market/MarketSellListingsModel";
import GetMarketListingsSteamAPIModel from "../../../models/models/steam/steam-market/steamAPI/GetMarketListingsSteamAPIModel";
import g_steamInstancesStores from "../../globals/g_steamInstancesStores";
import getMarketListingsAPIModel from "./getMarketListingsAPIModel";

export default async function getAllMarketListings() {
  const clients = Object.values(g_clientWorkersInformation);
  const groupedByIp = _.groupBy(clients, "publicIp");
  const listings: MarketSellListingsModel = { eur: [], usd: [], rub: [] };
  const promises = RecordFunctions.map(groupedByIp, async (clients) => {
    for (const client of clients) {
      const community = g_steamInstancesStores[client._id]?.community;
      if (!community) {
        log.error(new StackTrace(), `community for client id ${client._id} is not found`);
        break;
      }
      let page = 0;
      while (true) {
        let body: GetMarketListingsSteamAPIModel;

        await getMarketListingsAPIModel(community, page * 100)
          .then((r) => (body = r))
          .catch((error) => log.error(error));

        if (typeof body! === "undefined") {
          break;
        }

        const items = parseMarketListingPage(body);

        const currency = ECurrency[client.walletCurrency];
        items.forEach((item) => {
          const existingItem = listings[currency].find((i) => i.marketHashName === item.marketHashName && i.price === item.marketPrice);

          if (existingItem) {
            existingItem.amount++;
          } else {
            listings[currency].push({
              amount: 1,
              marketHashName: item.marketHashName,
              price: item.marketPrice,
            });
          }
        });

        if (items.length < 100) {
          // there are maximum of 100 listings per page, if we hit below 100, that means there is no another page
          break;
        }

        page++;
      }
    }
  });

  await Promise.all(Object.values(promises)).catch();

  return listings;
}

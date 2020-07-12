import MarketSellOrderModel from "../../../../../models/models/steam/steam-market/MarketSellOrderModel";
import chunkArray from "../../../../../functions/chunkArray";
import g_availableIPs from "../../../globals/g_availableIPs";
import getMarketOrdersHistogram, { getMarketOrdersHistogramType } from "./getMarketOrdersHistogram";
import DbServiceBase from "../../../../../data/services/Base/DbServiceBase";
import SteamMarketIdToMarketHashNameMapModel from "../../../../../models/models/steam/steam-market/SteamMarketIdToMarketHashNameMapModel";
import { EMongoDbCollectionNames } from "../../../../../data/EMongoDbCollectionNames";
import getAndSetMarketItemId from "./getAndSetMarketItemId";
import log from "../../../../../classes/logger/Log";
import wait from "../../../../../functions/wait";

export default async function getAllMarketOrdersHistogramFromSellOrders(
  orders: Record<string, MarketSellOrderModel>
): Promise<Record<string, getMarketOrdersHistogramType>> {
  const ordersMarketHashNames = Object.values(orders).map((o) => o._id);
  const ips = g_availableIPs;
  const chunkSize = Math.ceil(ordersMarketHashNames.length / ips.length);
  const chunks = chunkArray(ordersMarketHashNames, chunkSize);
  console.log("chunk size", chunkSize, "chunks", chunks, "orders", ordersMarketHashNames);
  const db = new DbServiceBase<SteamMarketIdToMarketHashNameMapModel>(EMongoDbCollectionNames.SteamMarketIdToMarketHashNameMap);
  const result: Record<string, getMarketOrdersHistogramType> = {};
  const promises = chunks.map(async (marketHashNames, index) => {
    const ip = ips[index];
    for (const name of marketHashNames) {
      console.log(`getting order with market hash name`, name);
      let doc = await db.findOne(name);
      let nameId: string;
      if (doc) {
        nameId = doc.itemNameId;
      } else {
        nameId = (await getAndSetMarketItemId(name).catch((err) => log.error(err))) as string;
      }
      if (!nameId) {
        continue;
      }
      await getMarketOrdersHistogram(nameId, ip)
        .then((r) => (result[name] = r))
        .catch((err) => log.error(err));
      await wait(1000);
    }
  });

  // change with promise.allsettled when ts-node can compile it
  await Promise.all(promises).catch();

  return result;
}

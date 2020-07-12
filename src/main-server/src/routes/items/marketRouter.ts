import MarketSellOrderModel from "../../../../models/models/steam/steam-market/MarketSellOrderModel";
import g_marketSellOrders from "../../globals/g_marketSellOrders";
import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";
import { BulkWriteOperation, BulkWriteUpdateOneOperation } from "mongodb";
import g_marketStatus from "../../globals/g_marketStatus";
import _sellItemsOnMarketByPrice from "../../functions/childs/market/sellItemsOnMarketByPrice";
import getMarketOrdersHistogram from "../../functions/childs/market/getMarketOrdersHistogram";
import getAllMarketOrdersHistogramFromSellOrders from "../../functions/childs/market/getAllMarketOrdersHistogramFromSellOrders";

export async function fr_updateMarketSellOrders(orders: Record<string, MarketSellOrderModel>) {
  Object.assign(g_marketSellOrders, orders);

  const db = new DbServiceBase<MarketSellOrderModel>(EMongoDbCollectionNames.MarketSellOrders);

  const ordersValue = Object.values(orders);

  const bulkUpdateOneOperations: BulkWriteOperation<MarketSellOrderModel>[] = ordersValue.map<BulkWriteOperation<MarketSellOrderModel>>((o) => ({
    updateOne: { filter: { _id: o._id }, update: { $set: o }, upsert: true },
  }));

  return await db.bulkWrite(bulkUpdateOneOperations);
}

export function fr_getMarketSellOrders() {
  return g_marketSellOrders;
}

export function fr_getMarketStatus() {
  return g_marketStatus;
}

export function fr_updateMarketStatus(update: Partial<typeof g_marketStatus>) {
  Object.assign(g_marketStatus, update);
  return g_marketStatus;
}

export function fr_sellItemsOnMarketByPrice() {
  return _sellItemsOnMarketByPrice(g_marketSellOrders);
}

export function fr_getAllMarketOrdersHistogramFromSellOrders() {
  return getAllMarketOrdersHistogramFromSellOrders(g_marketSellOrders);
}

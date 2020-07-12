import MarketSellOrderModel from "../../../../../models/models/steam/steam-market/MarketSellOrderModel";
import { EMongoDbCollectionNames } from "../../../../../data/EMongoDbCollectionNames";
import DbServiceBase from "../../../../../data/services/Base/DbServiceBase";
import g_marketSellOrders from "../../../globals/g_marketSellOrders";

export default async function initializeMarket() {
  const db = new DbServiceBase<MarketSellOrderModel>(EMongoDbCollectionNames.MarketSellOrders);
  const docs = await db.findMany({}).toArray();

  docs.forEach((d) => (g_marketSellOrders[d._id] = d));
}

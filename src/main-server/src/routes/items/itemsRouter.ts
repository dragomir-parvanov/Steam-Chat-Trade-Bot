import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";
import ItemSellInformationModel from "../../../../models/models/steam/steam-market/ItemSellInformationModel";

export async function fr_getItemsSellInformation(items: string[]) {
  const db = new DbServiceBase<ItemSellInformationModel>(EMongoDbCollectionNames.ItemsSellInformation);

  const result = await db.findMany({ _id: { $in: items } }).toArray();

  return result;
}

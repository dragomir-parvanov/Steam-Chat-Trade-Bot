import log from "../../../../../../classes/logger/Log";
import DbServiceBase from "../../../../../../data/services/Base/DbServiceBase";
import ItemSellInformationModel from "../../../../../../models/models/steam/steam-market/ItemSellInformationModel";
import { EMongoDbCollectionNames } from "../../../../../../data/EMongoDbCollectionNames";
import ItemSellInformationParsedSteamAPIModel from "../../../../../../models/models/steam/steam-items/ItemSellInformationParsedSteamAPIModel";

const dbService = new DbServiceBase<ItemSellInformationModel>(EMongoDbCollectionNames.ItemsSellInformation);
export default async function updateItemsSellInformation(items: ItemSellInformationParsedSteamAPIModel[]): Promise<void> {
  for (const item of items) {
    await dbService.updateOne({ _id: item._id }, { $set: { ...item } }).catch((error) => log.error(error, `Couldn't update item price, market hash name: ${item._id}`));
  }
}

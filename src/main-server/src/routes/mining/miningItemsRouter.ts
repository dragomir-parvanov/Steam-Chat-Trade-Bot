import updateItemsSellInformation from "./functions/items/updateItemsSellInformation";
import { profilesBatchConstant } from "./config/profilesBatchConstant";
import { itemBatchConstant } from "./config/itemBatchConstant";
import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";
import g_miningStatus from "../../globals/g_miningStatus";
import checkUserClaims from "../../passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import ItemSellInformationModel from "../../../../models/models/steam/steam-market/ItemSellInformationModel";
import ItemSellInformationParsedSteamAPIModel from "../../../../models/models/steam/steam-items/ItemSellInformationParsedSteamAPIModel";

const itemWithPriceService = new DbServiceBase<ItemSellInformationParsedSteamAPIModel>(EMongoDbCollectionNames.ItemsSellInformation);

// skipping scanned items.
let currentItemSkip = 0;

// getting items to mine
// circling through all items

export async function fr_getItemsToMine() {
  if (!g_miningStatus.isItemMiningAllowed) {
    throw new Error("Mining items is currently forbidden");
  }
  const cursor = itemWithPriceService.findMany({}, { _id: 1 }).skip(currentItemSkip).limit(profilesBatchConstant);
  currentItemSkip += profilesBatchConstant;

  const items = await cursor.toArray();

  // reseting counter because we are at the end of the collection.
  if (items.length < itemBatchConstant) {
    currentItemSkip = 0;
  }

  return items.map((i) => i._id);
}

export async function fr_sendMinedItems(items: ItemSellInformationParsedSteamAPIModel[]) {
  await updateItemsSellInformation(items);
}

export async function fr_addItem(newItem: Pick<ItemSellInformationModel, "_id" | "droppable">) {
  newItem._id = newItem._id.trim();
  const item: ItemSellInformationModel = { ...newItem, averagePrice: 0, sellPrice: 0, volume: 0, lowestPrice: 0 };

  const db = new DbServiceBase<ItemSellInformationModel>(EMongoDbCollectionNames.ItemsSellInformation);

  await db.insertOne(item);
}

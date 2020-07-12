import SentItemsInOffersModel from "../../models/SentItemsInOffersModel";
import { SteamId64 } from "../../../models/types/SteamId64";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import { BulkWriteOperation } from "mongodb";

export default async function revertNotSpecialItemsDbOperation(items: SentItemsInOffersModel[], clientId: SteamId64): Promise<void> {
  const db = new DbServiceBase<SentItemsInOffersModel>(EMongoDbCollectionNames.SentItemsInOffers);
  const removingOperations: BulkWriteOperation<SentItemsInOffersModel>[] = [];
  items.forEach((i) => {
    removingOperations.push({
      updateOne: {
        filter: { clientId, marketHashName: i.marketHashName },
        update: { $pull: { items: { assetId: { $in: i.items.map((i2) => i2.assetId) } } } },
      },
    });
  });
  const addingOperations: BulkWriteOperation<SentItemsInOffersModel>[] = [];
  items.forEach((i) => {
    addingOperations.push({
      updateOne: {
        filter: { clientId, marketHashName: i.marketHashName },
        update: { $push: { items: { $each: i.items } } },
      },
    });
  });
  await db.bulkWrite(removingOperations);
  await db.bulkWrite(addingOperations);
}

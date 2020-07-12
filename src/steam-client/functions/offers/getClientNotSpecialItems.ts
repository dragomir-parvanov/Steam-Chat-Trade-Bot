import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import SentItemsInOffersModel from "../../models/SentItemsInOffersModel";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import { NotSpecialItemsInTradOfferModel } from "../../../models/models/steam/steam-offers/SendTradeOfferModel";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import { SteamId64 } from "../../../models/types/SteamId64";
import { FilterQuery, BulkWriteOperation, BulkWriteUpdateOneOperation } from "mongodb";
import isItemSpecial from "../../../business-logic/functions/isItemSpecial";

export default async function getClientNotSpecialItems(
  neededItems: NotSpecialItemsInTradOfferModel[],
  clientItems: ParsedItemModel[],
  clientId: SteamId64,
  partnerId: SteamId64
): Promise<SentItemsInOffersModel[]> {
  if (neededItems.length === 0) {
    return [];
  }

  const db = new DbServiceBase<SentItemsInOffersModel>(EMongoDbCollectionNames.SentItemsInOffers);
  const query: typeof db.query = {
    clientId,
    marketHashName: { $in: neededItems.map((i) => i.marketHashName) },
  };

  const cursor = db.findMany(query);
  const dbItems = await cursor.toArray();
  const availableItems = clientItems.filter((i) => i.isTradable && neededItems.some((i2) => i.marketHashName === i2.marketHashName)).filter((i) => !isItemSpecial(i)); // no special items

  const result: SentItemsInOffersModel[] = [];
  const newDocs: SentItemsInOffersModel[] = [];
  for (const item of neededItems) {
    const dbItem = dbItems.find((i) => i.marketHashName === item.marketHashName);

    const newDoc: SentItemsInOffersModel = {
      _id: dbItem?._id,
      marketHashName: item.marketHashName,
      clientId,
      items: dbItem?.items || [],
    };

    if (!dbItem) {
      const notInDb = availableItems.filter((i) => i.marketHashName === item.marketHashName);

      if (notInDb.length < item.count) {
        throw new Error(`We have ${notInDb.length} ${item.marketHashName} but we need ${item.count}`);
      } else {
        // limiting to the items we need
        notInDb.length = item.count;
        const r = createSentItemsInOfferFromParsedItem(notInDb, newDoc);
        result.push(r);
        newDoc.items.push(...r.items);
      }
    } else {
      const notInDb = availableItems.filter(
        (availableItem) => availableItem.marketHashName === item.marketHashName && !newDoc.items.some((dbI) => dbI.assetId === availableItem.assetId)
      );

      if (notInDb.length < item.count) {
        // combining items that exist in the database and the inventory, and items that exist only in the inventory
        const total = createSentItemsInOfferFromParsedItem(notInDb, newDoc);
        newDoc.items.push(...total.items);
        // need to get some that exist in the database and steam inventory
        for (let a = 0; a < item.count - notInDb.length; a++) {
          // getting the first item which is sent the most long tiem ago
          const firstItem = newDoc.items.shift();

          if (!firstItem) {
            throw new Error(`We dont have item with market hash name ${item.marketHashName}`);
          }

          const { assetId } = firstItem;
          const availableItem = availableItems.find((i) => i.assetId === assetId);

          if (!availableItem) {
            // does exist in the database, but does NOT exist in the partner inventory
            a--;
            continue;
          }
          newDoc.items.push(firstItem);
          total.items.push(firstItem);
        }
        result.push(total);
      } else {
        notInDb.length = item.count;
        const r = createSentItemsInOfferFromParsedItem(notInDb, newDoc);
        result.push(r);
        newDoc.items.push(...r.items);
      }
    }
    newDocs.push(newDoc);
  }
  const operations: BulkWriteOperation<SentItemsInOffersModel>[] = [];
  newDocs.forEach((d) => {
    let query: FilterQuery<SentItemsInOffersModel>;
    if (d._id) {
      query = { _id: d._id };
      query = { clientId, marketHashName: d.marketHashName };
    } else {
      // strangely even if d._id doesnt exist i need to delete it in order for this to work
      delete d._id;
      query = { clientId, marketHashName: d.marketHashName };
    }
    const operation: BulkWriteUpdateOneOperation<SentItemsInOffersModel> = {
      updateOne: { filter: query, update: { $set: d }, upsert: true },
    };
    operations.push(operation);
  });

  await db.bulkWrite(operations);
  return result;
}

function createSentItemsInOfferFromParsedItem(items: ParsedItemModel[], doc: SentItemsInOffersModel): SentItemsInOffersModel {
  const result: SentItemsInOffersModel = {
    ...doc,
    ...{
      items: items.map(({ assetId }) => {
        return { assetId, sentOn: new Date() };
      }),
    },
  };
  return result;
}

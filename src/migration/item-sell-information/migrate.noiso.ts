import ItemSellInformationModel from "../../models/models/steam/steam-market/ItemSellInformationModel";
import DbServiceBase from "../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../data/EMongoDbCollectionNames";
import getMongoDb from "../../data/functions/getMongoDb";
import json from "./items.json";
const dbEntities: ItemSellInformationModel[] = json.map((i) => {
  return {
    _id: i.Name.trim(),
    sellPrice: 0,
    averagePrice: 0,
    droppable: i.Droppable,
    lowestPrice: 0,
    volume: 0,
  };
});
console.log(dbEntities.length);
const db = new DbServiceBase<ItemSellInformationModel>(EMongoDbCollectionNames.ItemsSellInformation);
getMongoDb()
  .then((db) => (DbServiceBase.db = db))
  .then(async () => await db.insertMany(dbEntities, { ordered: false }))
  .then(() => console.log("finished"));

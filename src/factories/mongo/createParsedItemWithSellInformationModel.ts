import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import DbServiceBase from "../../data/services/Base/DbServiceBase";
import ItemSellInformationModel from "../../models/models/steam/steam-market/ItemSellInformationModel";
import { EMongoDbCollectionNames } from "../../data/EMongoDbCollectionNames";
import { FilterQuery } from "mongoose";
import LogError from "../../classes/errors/base/LogError";
import calculateItemApplyingsPrice from "../../business-logic/functions/calculateItemApplyingsPrice";
import ParsedItemModel from "../../models/models/steam/steam-items/ParsedItemModel";

export function onNotFoundItem(parsedItem: ParsedItemModel): ParsedItemWithSellInformationModel {
  return {
    ...parsedItem,
    ...{
      applyingsPrice: 0,
      sellPrice: 0,
      averagePrice: 0,
      lowestPrice: 0,
      _id: parsedItem.marketHashName,
      volume: 0,
      droppable: false,
      isSpecial: false,
    },
  };
}
export function onNoPriceSchemaFound(marketHashName: string): ItemSellInformationModel {
  return {
    _id: marketHashName,
    droppable: false,
    sellPrice: 0,
    volume: 0,
    lowestPrice: 0,
    averagePrice: 0,
  };
}
export default async function createParsedItemInventoryWithSellInformationModel(parsedItems: ParsedItemModel[]): Promise<ParsedItemWithSellInformationModel[]> {
  const dbService = new DbServiceBase<ItemSellInformationModel>(EMongoDbCollectionNames.ItemsSellInformation);

  // clearing of duplicates
  const marketHashNames = [...new Set(parsedItems.map((i) => i.marketHashName))];
  const query: FilterQuery<ItemSellInformationModel> = {
    _id: { $in: marketHashNames },
  };

  const itemsSellInformationSchemma = await dbService.findMany(query).toArray();

  // parsed items which have sell schema.
  const itemsWithSchema = parsedItems.filter((i) => itemsSellInformationSchemma.some((is) => i.marketHashName === is._id));

  // parsed items which doesnt have sell schema.
  const itemsWithNoSchema = parsedItems.filter((i) => !itemsWithSchema.some((is) => i === is));

  // combining the sell schema with the parsed item.
  const combinedParsedItemWithSchema = itemsWithSchema.map<ParsedItemWithSellInformationModel>((item) => {
    const sellInformation = itemsSellInformationSchemma.find((i) => i._id === item.marketHashName);
    if (!sellInformation) {
      throw new LogError(`Item with market hash name ${item.marketHashName} should have existed in the schema`);
    }
    const additionalPrice = calculateItemApplyingsPrice(item, sellInformation);
    return {
      ...item,
      ...sellInformation,
      ...{ applyingsPrice: additionalPrice },
      isSpecial: additionalPrice > 0,
    };
  });

  // setting no prices on items that doesnt have price schema.
  const combinedParsedItemWithNoSchema = itemsWithNoSchema.map(onNotFoundItem);

  return [...combinedParsedItemWithNoSchema, ...combinedParsedItemWithSchema];
}

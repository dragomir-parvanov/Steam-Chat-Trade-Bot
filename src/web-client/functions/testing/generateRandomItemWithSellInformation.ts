import ParsedItemWithSellInformationModel from "../../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import ItemSellInformationModel from "../../../models/models/steam/steam-market/ItemSellInformationModel";
import chance from "../../../functions/chance";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import generateGUID from "../../../functions/generateGUID";
import { ECSGOItemExteriorCondition } from "../../../models/enums/ECSGOItemWearCondition";
import createItemWithSellInformationFromSchema from "../../factories/createItemWithSellInformationFromSchema";
import g_itemsPricesSchema from "../../globals/g_itemsPricesSchema";

export default function generateRandomItemWithSellInformation(marketHashName?: string): ParsedItemWithSellInformationModel {
  const price = Math.round((Math.random() * 0.9 + Number.EPSILON) * 100) / 100;
  const _id = marketHashName ? marketHashName : generateGUID();
  let schema: ItemSellInformationModel = g_itemsPricesSchema[_id];
  if (!schema) {
    schema = {
      averagePrice: price,
      lowestPrice: price,
      volume: Math.floor(Math.random() * 1000),
      _id,
      sellPrice: price,
      droppable: Math.random() > 0.1,
    };
  }

  g_itemsPricesSchema[_id] = schema;
  const item: ParsedItemModel = {
    marketHashName: _id,
    assetId: generateGUID(),
    appId: 730,
    stickers: [],
    contextId: 2,
    isTradable: Math.random() > 0.3,
    isStattrak: false,
    isSouvenir: false,
    itemName: _id,
    amount: 1,
    exteriorCondition: ECSGOItemExteriorCondition.MinimalWear,
    imageUrl: "test",
    largeImageUrl: "test",
    isSpecial: false,
  };

  return createItemWithSellInformationFromSchema(schema, item);
}

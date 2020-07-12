import ParsedItemModel from "../../models/models/steam/steam-items/ParsedItemModel";
import ItemSellInformationModel from "../../models/models/steam/steam-market/ItemSellInformationModel";
import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import calculateItemApplyingsPrice from "../../business-logic/functions/calculateItemApplyingsPrice";
import isItemSpecial from "../../business-logic/functions/isItemSpecial";

export default function createItemWithSellInformationFromSchema(schema: ItemSellInformationModel, item: ParsedItemModel): ParsedItemWithSellInformationModel {
  const applyingsPrice = calculateItemApplyingsPrice(item);
  const isSpecial = isItemSpecial(item);
  const priceItem: ParsedItemWithSellInformationModel = {
    ...item,
    ...schema,
    applyingsPrice,
    isSpecial,
  };
  return priceItem;
}

import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import { ItemsTradeOfferDirectiveModel } from "../../../../models/models/steam/steam-offers/SendTradeOfferModel";
import _ from "lodash";
import getNotSpecialItemsFromParsedItems from "./getNotSpecialItemsFromParsedItems";

export default function createItemsTradeOfferDirective(items: ParsedItemModel[]): ItemsTradeOfferDirectiveModel {
  const [specialItems, notSpecialItems] = _.partition(items, (i) => i.isSpecial);
  const specialItemsInOffer = specialItems.map((i) => i.assetId);
  const notSpecialItemsInOffer = getNotSpecialItemsFromParsedItems(notSpecialItems);

  const result: ItemsTradeOfferDirectiveModel = {
    notSpecialItems: notSpecialItemsInOffer,
    exactItemAssetIds: specialItemsInOffer,
  };

  return result;
}

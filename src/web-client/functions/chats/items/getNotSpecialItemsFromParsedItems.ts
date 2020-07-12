import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import { ItemsTradeOfferDirectiveModel, NotSpecialItemsInTradOfferModel } from "../../../../models/models/steam/steam-offers/SendTradeOfferModel";

export default function getNotSpecialItemsFromParsedItems(items: ParsedItemModel[]): NotSpecialItemsInTradOfferModel[] {
  const hash: Record<string, number> = {};
  items.forEach((i) => {
    if (hash[i.marketHashName]) {
      hash[i.marketHashName]++;
    } else {
      hash[i.marketHashName] = 1;
    }
  });

  const result: NotSpecialItemsInTradOfferModel[] = Object.entries(hash).map<NotSpecialItemsInTradOfferModel>((i) => {
    return {
      marketHashName: i[0],
      count: i[1],
    };
  });

  return result;
}

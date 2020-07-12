import AssetId from "../../../models/types/AssetId";
import { NotSpecialItemsInTradOfferModel } from "../../../models/models/steam/steam-offers/SendTradeOfferModel";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import { SteamId64 } from "../../../models/types/SteamId64";
import isItemSpecial from "../../../business-logic/functions/isItemSpecial";

export default function getPartnerNotSpecialItems(
  neededItems: NotSpecialItemsInTradOfferModel[],
  partnerItems: ParsedItemModel[],
  clientId: SteamId64,
  partnerId: SteamId64
): AssetId[] {
  const availableItems = partnerItems.filter((i) => i.isTradable && !isItemSpecial(i));
  const assetIds: AssetId[] = [];
  neededItems.forEach((neededItem) => {
    const items = availableItems.filter((i) => i.marketHashName === neededItem.marketHashName);
    if (items.length < neededItem.count) {
      throw new Error(`We have ${items.length} ${neededItem.marketHashName} but we need ${neededItem.count}`);
    }
    items.length = neededItem.count;
    assetIds.push(...items.map((i) => i.assetId));
  });

  return assetIds;
}

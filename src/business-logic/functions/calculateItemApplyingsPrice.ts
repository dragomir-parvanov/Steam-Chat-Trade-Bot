import { MAX_STICKER_PRICE } from "../constants/items/MAX_STICKER_PRICE";
import { ITEM_SELL_INFORMATION_STICKER_MULTIPLIER } from "../constants/items/ITEM_SELL_INFORMATION_STICKER_MULTIPLIER";
import { ITEM_NAMETAG_ADDITIONAL_PRICE_VALUE } from "../constants/items/ITEM_NAMETAG_ADDITIONAL_PRICE_VALUE";
import ParsedItemModel from "../../models/models/steam/steam-items/ParsedItemModel";
import ItemSellInformationModel from "../../models/models/steam/steam-market/ItemSellInformationModel";
import { STICKER_ADDITIONAL_VALUE_MULTIPLIER } from "../constants/items/STICKER_ADDITIONAL_VALUE_MULTIPLIER";

export default function calculateItemApplyingsPrice(item: ParsedItemModel, itemSellInformation?: ItemSellInformationModel): number {
  let price = 0;
  if (!itemSellInformation || itemSellInformation.sellPrice === 0) {
    return 0;
  }
  if (!item.isSouvenir) {
    if (item.stickers.length > 0) {
      price += item.stickers.reduce<number>((acc) => acc + 0.02, 0);
      let stickerAdditionalPrice =
        (itemSellInformation.sellPrice | (itemSellInformation.averagePrice * STICKER_ADDITIONAL_VALUE_MULTIPLIER)) * item.stickers.length;
      if (stickerAdditionalPrice > MAX_STICKER_PRICE * item.stickers.length) {
        stickerAdditionalPrice = item.stickers.length * MAX_STICKER_PRICE;
      }
      price += stickerAdditionalPrice;
    }
  }

  if (item.nametag) {
    price += ITEM_NAMETAG_ADDITIONAL_PRICE_VALUE;
  }
  return price;
}

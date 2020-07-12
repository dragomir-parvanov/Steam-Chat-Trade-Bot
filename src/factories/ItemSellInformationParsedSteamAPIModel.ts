//import { maxPriceOnSteamMarketConstant } from "../models/constants/maxPriceOnMarketConstant";

import ItemSellInformationSteamAPIModel from "../models/models/steam/steam-market/steamAPI/ItemSellInformationSteamAPIModel";
import ItemSellInformationParsedSteamAPIModel from "../models/models/steam/steam-items/ItemSellInformationParsedSteamAPIModel";

export function parseMarketPrice(price?: string): number {
  if (!price) {
    return 0;
  }

  price = price.replace(new RegExp(",", "g"), ".");
  price = price.trim();
  for (let i = 0; i < price.length; i++) {
    // if the char is not a number, remove it from the string
    if (price[i] !== "." && Number.isNaN(parseInt(price[i]))) {
      price = price.slice(0, i) + price.slice(i + 1);
      i--;
    }
  }
  return parseFloat(price);
}

export function parseVolume(volume?: string): number {
  if (!volume) {
    return 0;
  }

  volume = volume.replace(new RegExp(",", "g"), "");
  return parseInt(volume);
}

export default function createItemSellInformationParsedSteamAPIModel(
  marketHashName: string,
  apiItem: ItemSellInformationSteamAPIModel
): ItemSellInformationParsedSteamAPIModel {
  const item: ItemSellInformationParsedSteamAPIModel = {
    _id: marketHashName,
    averagePrice: parseMarketPrice(apiItem.median_price),
    lowestPrice: parseMarketPrice(apiItem.lowest_price),
    volume: parseVolume(apiItem.volume),
  };

  // When an item doesnt have a price, the item is usually a very rare, because it is more expensive than the @maxPriceOnSteamMarketConstant
  // Dragon lore factory new is an example
  // This only works for csgo, because there is no rare item that is not on the market and doesnt exceed @maxPriceOnSteamMarketConstant
  // if (!apiItem.lowest_price) {
  //     item.lowestPrice = item.averagePrice === 0 ? maxPriceOnSteamMarketConstant : item.averagePrice;

  //     if (!apiItem.median_price) {
  //         item.averagePrice = maxPriceOnSteamMarketConstant
  //     }
  // }

  return item;
}

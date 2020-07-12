import ItemSellInformationParsedSteamAPIModel from "../../../../models/models/steam/steam-items/ItemSellInformationParsedSteamAPIModel";
import Axios from "axios";
import ItemSellInformationSteamAPIModel from "../../../../models/models/steam/steam-market/steamAPI/ItemSellInformationSteamAPIModel";
import createItemSellInformationParsedSteamAPIModel from "../../../../factories/ItemSellInformationParsedSteamAPIModel";
import { ITEM_WITH_PRICE_MAX_TRIES } from "../../../../shared-network/constants/steam/max-retries/ITEM_WITH_PRICE_MAX_TRIES";
import wait from "../../../../functions/wait";

/**
 * Gets the item from the steam market api and parses it.
 * @export
 * @param {string} itemMarketHashName
 * @returns {Promise<ItemSellInformationParsedSteamAPIModel>}
 */
export default async function getItemWithPrice(itemMarketHashName: string): Promise<ItemSellInformationParsedSteamAPIModel> {
  for (let i = 0; i < ITEM_WITH_PRICE_MAX_TRIES; i++) {
    try {
      // const url = "https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name="
      //     + encodeURIComponent(itemMarketHashName).replace(new RegExp("-", 'g'), "%20")// the regex is for encoding hyphen, because encodeURIComponent doesnt encode it
      const url = `https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=${itemMarketHashName}`;
      console.log(url);
      const response = await Axios.get<ItemSellInformationSteamAPIModel>(url);
      if (!response.data.success) {
        continue;
      }

      return createItemSellInformationParsedSteamAPIModel(itemMarketHashName, response.data);
    } catch (err) {
      console.log(`Error getting price of an item\nerror:${err}`);
      await wait(5000);
    }
  }

  throw new Error("Max tries with this item exceeded");
}


/**
 * Steam api response from:
 * https://steamcommunity.com/market/priceoverview/?currency=3&appid=730&market_hash_name=
 * @export
 * @interface ItemSellInformationSteamAPIModel
 */
export default interface ItemSellInformationSteamAPIModel  {
    success: boolean;
    lowest_price?: string;
    volume?: string;
    median_price?: string;
}
import DefaultSteamAPIMarketResponse from "../../DefaultSteamAPIMarketResponse";

/**
 * Array of array tupples,
 *  first tupple is the price of the order,
 *  the second is how many orders are there for that price,
 *  third is the html string
 */
export type SteamMarketItemsHistogramOrderGraphSteamAPIType = Array<[number, number, string]>;

export default interface SteamMarketItemsOrderHistogramSteamAPIModel extends DefaultSteamAPIMarketResponse {
  buy_order_graph: SteamMarketItemsHistogramOrderGraphSteamAPIType;
  sell_order_graph: SteamMarketItemsHistogramOrderGraphSteamAPIType;
}

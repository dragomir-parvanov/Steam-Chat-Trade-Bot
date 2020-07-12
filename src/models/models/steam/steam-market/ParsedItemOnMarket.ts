import ParsedItemModel from "../steam-items/ParsedItemModel";

export default interface ParsedItemOnMarket extends ParsedItemModel {
  /**
   * At what price we had placed the item in the market.
   */
  marketPrice: number;

  /**
   * The listing id that we can use to identify this item on the steam API
   */
  marketListingId: string;
}

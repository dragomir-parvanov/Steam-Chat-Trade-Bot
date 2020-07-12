import Identifiable from "../../../../data/identifiables/Identifiable";

/**
 * Identifiable must be the market hash name of an item.
 * @export
 * @interface ItemSellInformationParsedSteamAPIModel
 * @extends {Identifiable}
 */
export default interface ItemSellInformationParsedSteamAPIModel extends Identifiable {
  /**
   * This must be the market hash name of the item.
   * @type {string}
   * @memberof ItemSellInformationParsedSteamAPIModel
   */
  _id: string;

  /**
   * How much units of this item have been sold the last 24 hours on the steam market.
   * @type {number}
   * @memberof ItemSellInformationParsedSteamAPIModel
   */
  volume: number;

  /**
   * What is the average price of this item is in the last 24 hours on the steam market.
   * @type {number}
   * @memberof ItemSellInformationParsedSteamAPIModel
   */
  averagePrice: number;

  /**
   * The current lowest price on the steam market.
   * @type {number}
   * @memberof ItemSellInformationParsedSteamAPIModel
   */
  lowestPrice: number;
}

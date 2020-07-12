import ItemSellInformationParsedSteamAPIModel from "../steam-items/ItemSellInformationParsedSteamAPIModel";
import DroppableItem from "../../../interfaces/DroppableItem";

/**
 * Sell information for an item.
 * @export
 * @interface ItemSellInformation
 * @extends {ItemSellInformationParsedSteamAPIModel}
 * @extends {DroppableItem}
 */
export default interface ItemSellInformationModel extends ItemSellInformationParsedSteamAPIModel, DroppableItem {
  /**
   * The price that an item should be sold at
   * @type {number}
   * @memberof ItemSellInformation
   */
  sellPrice: number;
}

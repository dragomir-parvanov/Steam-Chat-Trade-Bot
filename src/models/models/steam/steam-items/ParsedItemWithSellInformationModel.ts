import ItemSellInformationModel from "../steam-market/ItemSellInformationModel";
import ParsedItemModel from "./ParsedItemModel";

export default interface ParsedItemWithSellInformationModel extends ItemSellInformationModel, ParsedItemModel {
  /**
   * The price with the additional value of stickers, nametags and etc...
   * We usually set this price.
   * @type {number}
   * @memberof ParsedItemWithSellInformationModel
   */
  applyingsPrice: number;
}

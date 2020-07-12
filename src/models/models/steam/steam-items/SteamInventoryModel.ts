import ParsedItemWithSellInformationModel from "./ParsedItemWithSellInformationModel";
import ParsedItemModel from "./ParsedItemModel";
import { EInventoryGetStatus } from "../../../enums/EInventoryGetStatus";

export default interface SteamInventoryModel {
  items: ParsedItemModel[];
  getStatus: EInventoryGetStatus;

  /**
   * Error message of
   * @example When we cannot get the inventory for unknown reasons, here we will have the message.
   * @type {string}
   * @memberof SteamInventoryModel
   */
  errorMessage?: string;
}

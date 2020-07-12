import BasicSteamInventoryItemAPIModel from "./BasicSteamInventoryItemAPIModel";
import DescriptionSteamAPIModel from "./DescriptionModelSteamAPI";
import TagSteamAPIModel from "./TagSteamAPIModel";

export default interface SteamItemAPIModel extends BasicSteamInventoryItemAPIModel {
  instanceid: string;

  descriptions: DescriptionSteamAPIModel[];

  tradable: number;

  market_hash_name: string;

  tags?: TagSteamAPIModel[];

  icon_url: string;

  icon_url_large?: string;

  fraudwarnings?: string[];

  /**
   * We know this comes from the market.
   * if status is 2, that means the item is confirmed on market
   * if status is 0, that means the item needs confirmation
   */
  status?: number;
}

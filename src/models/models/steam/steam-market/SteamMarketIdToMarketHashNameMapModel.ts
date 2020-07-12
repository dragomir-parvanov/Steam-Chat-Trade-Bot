import Identifiable from "../../../../data/identifiables/Identifiable";

export default interface SteamMarketIdToMarketHashNameMapModel extends Identifiable<string> {
  /**
   * The market hash naem of the item
   */
  _id: string;

  itemNameId: string;
}

import SteamInventoryModel from "../../models/models/steam/steam-items/SteamInventoryModel";
import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";

export default interface SteamInventoryWithSellInformationModel extends SteamInventoryModel {
  items: ParsedItemWithSellInformationModel[];
}

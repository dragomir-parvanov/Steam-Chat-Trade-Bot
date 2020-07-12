import ActiveChatModel from "../../models/ActiveChatModel";
import SteamInventoryModel from "../../models/models/steam/steam-items/SteamInventoryModel";
import SteamInventoryWithSellInformationModel from "./SteamInventoryWithSellInformation";

export default interface ClientActiveChatModel extends Omit<ActiveChatModel, "partnerInventory"> {
  partnerInventory: SteamInventoryWithSellInformationModel;
  isChecked: boolean;
}

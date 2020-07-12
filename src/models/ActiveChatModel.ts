import { EActiveChatTriggerAction } from "./enums/EActiveChatTriggerAction";
import SteamInventoryModel from "./models/steam/steam-items/SteamInventoryModel";

import ClientAndPartnerIdentfiables from "./interfaces/ClientAndPartnerIdentfiables";
import XMLParsedProfileModel from "./models/steam/steam-profiles/XMLParsedProfileModel";
import UserTradingInformationModel from "./models/steam/steam-offers/UserTradingInformationModel";
import { EPersonaState } from "../declarations/steam-user/EPersonaState";
export default interface ActiveChatModel extends ClientAndPartnerIdentfiables {
  personaState: EPersonaState;
  stateMessage: string;
  partnerProfile: Omit<XMLParsedProfileModel, "steamID">;
  isActive: boolean;
  partnerInventory: SteamInventoryModel;
  tradingInformation: UserTradingInformationModel;

  /**
   * What activated the chat.
   *
   * @type {EActiveChatTriggerAction}
   * @memberof ActiveChatModel
   */
  triggerAction: EActiveChatTriggerAction;

  /**
   * When the active chat was added.
   * @type {Date}
   * @memberof ActiveChatModel
   */
  addedOn: Date;
}

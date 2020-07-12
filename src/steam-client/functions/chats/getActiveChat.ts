import { SteamId64 } from "../../../models/types/SteamId64";
import ActiveChatModel from "../../../models/ActiveChatModel";
import SteamTradeOfferManagerFunctions from "../../../functions/steam/steam-trade-offer-manager/SteamTradeOfferManagerFunctions";
import SteamCommunityFunctions from "../../../functions/steam/steam-community/SteamCommunityFunctions";
import SteamUserFunctions from "../../../functions/steam/steam-user/SteamUserFunctions";
import SteamInventoryModel from "../../../models/models/steam/steam-items/SteamInventoryModel";
import { EActiveChatTriggerAction } from "../../../models/enums/EActiveChatTriggerAction";
import XMLParsedProfileModel from "../../../models/models/steam/steam-profiles/XMLParsedProfileModel";
import { EPersonaState } from "../../../declarations/steam-user/EPersonaState";

export default async function getActiveChat(clientId: SteamId64, partnerId: SteamId64): Promise<ActiveChatModel> {
  const managerFunctions = new SteamTradeOfferManagerFunctions(clientId);
  const userFunctions = new SteamUserFunctions(clientId);
  const communityFunctions = new SteamCommunityFunctions(clientId);
  const personaState = userFunctions.getSteamUser(partnerId)?.persona_state ?? EPersonaState.Offline;
  const partnerInventory = await communityFunctions.getInventory(partnerId, 730, 2, false, 5);
  const profile = await communityFunctions.getXMLParsedProfile(partnerId, 5);
  const tradeInformation = await managerFunctions.getUserTradeInformation(partnerId);
  const chat: ActiveChatModel = {
    clientId,
    partnerProfile: profile,
    tradingInformation: tradeInformation,
    partnerId,
    personaState,
    partnerInventory,
    addedOn: new Date(),
    isActive: true,
    triggerAction: EActiveChatTriggerAction.FriendMessage,
    stateMessage: "not implemented",
  };

  return chat;
}

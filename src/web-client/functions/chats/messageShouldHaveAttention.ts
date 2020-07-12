import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import ESteamChatMessageType from "../../../models/enums/ESteamChatMessageType";

export default function messageShouldHaveAttention(message: SteamChatMessageModel): boolean {
  if (!message.type) {
    return false;
  }
  switch (message.type) {
    case ESteamChatMessageType.Active:
      return false;
    case ESteamChatMessageType.ClientMessage:
      return false;

    default:
      return true;
  }
}

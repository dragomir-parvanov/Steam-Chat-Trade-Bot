import ESteamChatMessageType from "../../enums/ESteamChatMessageType";
import Identifiable from "../../../data/identifiables/Identifiable";
import { SteamId64 } from "../../types/SteamId64";

export default interface SteamChatMessageModel extends Identifiable {
  clientId: SteamId64;
  partnerId: SteamId64;
  addedOn: Date;
  type: ESteamChatMessageType;
  value: string;
}

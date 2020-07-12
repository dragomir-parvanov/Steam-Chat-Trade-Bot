import ToClientMessageModel from "../models/ToClientMessageModel";
import { SteamId64 } from "../../../models/types/SteamId64";
import SteamUserFunctions from "../../../functions/steam/steam-user/SteamUserFunctions";

export default function client_sendMessage(this: ToClientMessageModel, message: string, partnerId: SteamId64) {
  const userFunctions = new SteamUserFunctions(this.clientId);

  userFunctions.sendMessage(message, partnerId);
}

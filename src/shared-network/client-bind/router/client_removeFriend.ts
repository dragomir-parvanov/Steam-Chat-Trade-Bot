import ToClientMessageModel from "../models/ToClientMessageModel";
import SteamUserFunctions from "../../../functions/steam/steam-user/SteamUserFunctions";

export default function client_removeFriend(this: ToClientMessageModel, ...args: Parameters<SteamUserFunctions["removeFriend"]>) {
  const userFunctions = new SteamUserFunctions(this.clientId);

  userFunctions.removeFriend(...args);
}

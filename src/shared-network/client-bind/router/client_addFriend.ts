import ToClientMessageModel from "../models/ToClientMessageModel";
import { SteamId64 } from "../../../models/types/SteamId64";
import SteamUserFunctions from "../../../functions/steam/steam-user/SteamUserFunctions";

export default function client_addFriend(this: ToClientMessageModel, partnerId: SteamId64) {
  const userFunctions = new SteamUserFunctions(this.clientId);

  userFunctions.addFriend(partnerId);
}

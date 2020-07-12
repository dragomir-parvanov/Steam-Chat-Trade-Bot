import SteamCommunity from "steamcommunity";
import log from "../../../classes/logger/Log";
import TradeOfferManager from "steam-tradeoffer-manager";
import callUserLogOn from "../../steam-login/user/config/functions/callUserLogOn";
import SteamUser from "steam-user";
import { SteamId64 } from "../../../models/types/SteamId64";

export default function initializeSteamCommunityEventHandler(clientId: SteamId64, user: SteamUser, community: SteamCommunity, manager: TradeOfferManager): void {
  community.on("sessionExpired", function (err) {
    if (err) {
      console.log("Session Expired: " + err);
    }

    if (user.steamID) {
      user.webLogOn();
    } else {
      callUserLogOn(user, clientId);
      log.do(["Called user logOn because of session expired error:", err]);
    }
  });
}

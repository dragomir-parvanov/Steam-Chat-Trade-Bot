import SteamUser, { SteamUserOptions } from "steam-user";
import { SteamId64 } from "../../../models/types/SteamId64";
import promisifySteamUser from "../../../functions/promisify/promisifySteamUser";
import { PromisifiedSteamUser } from "../../../models/types/PromisifiedSteamUser";
import { steamUserOptions } from "./config/steamUserOptions";
import callUserLogOn from "./config/functions/callUserLogOn";
import g_steamCookies from "./config/g_steamCookies";
import { EPersonaState } from "../../../declarations/steam-user/EPersonaState";
import SteamClientModel from "../../../models/models/steam/steam-profiles/SteamClientModel";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import { parseVolume, parseMarketPrice } from "../../../factories/ItemSellInformationParsedSteamAPIModel";
import { ECurrency } from "../../../models/enums/ECurrency";
import LogError from "../../../classes/errors/base/LogError";
import ECurrencyCode from "../../../declarations/steam-user/EcurrencyCode";
import g_clientWorkersInformation from "../../../main-server/src/globals/g_clientWorkersInformation";
export default async function steamUserLogin(client: SteamClientModel): Promise<PromisifiedSteamUser> {
  return new Promise(async (resolve) => {
    const user = promisifySteamUser(new SteamUser());
    user.setOptions(steamUserOptions);
    user.setOption("localAddress", client.publicIp);
    await callUserLogOn(user, client._id);

    user.on("webSession", (sid, cookies) => {
      g_steamCookies[client._id].next(cookies);
    });

    user.on("loggedOn", () => {
      resolve(user);
      user.setPersona(EPersonaState.Online);

      // playing CSGO
      user.requestFreeLicense(["730"], () => {
        user.gamesPlayed([730]);
      });
      user.webLogOn();
    });
  });
}

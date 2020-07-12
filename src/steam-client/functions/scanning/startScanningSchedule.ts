import RecordFunctions from "../../../classes/RecordFunctions";
import { EFriendRelationship } from "../../../models/enums/EFriendRelationship";
import scanProfile from "./scanProfile";
import wait from "../../../functions/wait";
import isProfileEligibleForScanning from "./isProfileEligibleForScanning";
import SteamUser from "steam-user";
import FRIEND_LIST_SCANNING_INTERVAL_WAIT from "../../config/FRIEND_LIST_SCANNING_INTERVAL_WAIT";
import log from "../../../classes/logger/Log";
import { SteamId64 } from "../../../models/types/SteamId64";

export default function startScanningSchedule(clientId: SteamId64, client: SteamUser): void {
  fetchFriendList(clientId, client);
  setInterval(() => fetchFriendList(clientId, client), FRIEND_LIST_SCANNING_INTERVAL_WAIT);
}

export async function fetchFriendList(clientId: SteamId64, client: SteamUser): Promise<void> {
  log.do("Scanning friend list");
  const friendsOnly = RecordFunctions.filter(client.myFriends, (status) => status === EFriendRelationship.Friend);
  for (const partnerId in friendsOnly) {
    const eligble = await isProfileEligibleForScanning(clientId, partnerId, client);
    if (eligble) {
      console.log("performing a scan");
      await scanProfile(clientId, partnerId).catch((error) => console.log(`Error while scanning ${partnerId}, error ${error}`));

      // waiting some time before scanning another one, do not want to flood the server.
      await wait(3000);
    }
  }
}

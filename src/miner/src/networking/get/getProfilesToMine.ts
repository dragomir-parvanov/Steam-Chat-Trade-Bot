import Axios from "axios";
import { hostConfig } from "../../config/hostConfig";
import { minerAxiosDefaultConfig } from "../../config/minerAxiosDefaultConfig";

import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import { SteamId64 } from "../../../../models/types/SteamId64";
const alreadyMinnedProfiles = new Set<string>();

/**
 * Get the profiles that needs to be mined from the main server.
 * @export
 * @returns {Promise<SteamId64[]>}
 */
export default async function getProfilesToMine(): Promise<SteamId64[]> {
  const profiles = await mainConnect.mining.profiles.getProfilesToMine();
  profiles.forEach((p, i) => {
    if (alreadyMinnedProfiles.has(p)) {
      console.log(`We already got profile ${p} and we have mined it before`);
      profiles.splice(i, 1);
    } else {
      alreadyMinnedProfiles.add(p);
    }
  });
  return profiles;
}

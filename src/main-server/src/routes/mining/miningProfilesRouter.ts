import { getToBeMinedProfiles } from "./functions/profiles/getToBeMinedProfiles";
import filterMinedProfile from "./functions/filter/filterMinedProfile";
import g_miningStatus from "../../globals/g_miningStatus";
import getNeverScannedProfiles from "./functions/profiles/getNeverScannedProfiles";
import { profilesBatchConstant } from "./config/profilesBatchConstant";
import XMLParsedProfileWithInventoryModel from "../../../../models/models/steam/steam-profiles/XMLParsedProfileWithInventoryModel";

export async function fr_getProfilesToMine() {
  if (!g_miningStatus.isProfileMiningAllowed) {
    throw new Error("Mining profile is currently forbidden");
  }
  const toBeScannedProfiles = await getToBeMinedProfiles();

  if (toBeScannedProfiles.length > 0) {
    return toBeScannedProfiles.map((p) => p._id);
  }

  const profiles = await getNeverScannedProfiles(profilesBatchConstant);
  return profiles.map((p) => p._id);
}

export async function fr_sendMinedProfiles(profiles: XMLParsedProfileWithInventoryModel[]) {
  await Promise.all(profiles.map(async (p) => await filterMinedProfile(p)));
}

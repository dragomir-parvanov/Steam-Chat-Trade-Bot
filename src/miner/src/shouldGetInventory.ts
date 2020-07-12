import XMLParsedProfileModel from "../../models/models/steam/steam-profiles/XMLParsedProfileModel";

/**
 * If we should get the inventory of a profile when mining.
 * @export
 * @param {XMLParsedProfileModel} profile
 * @returns {boolean}
 */
export default function shouldGetInventory(profile: XMLParsedProfileModel): boolean {
  if (profile.isLimitedAccount) {
    return true;
  }

  return false;
}

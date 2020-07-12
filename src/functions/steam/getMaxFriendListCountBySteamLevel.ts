import { defaultFriendListCountConstant } from "../../models/constants/defaultFriendListCountConstant";

/**
 * Getting the  max friend list count that a profile can have by the steam level of the profile.
 * @export
 * @param {number} level
 * @returns
 */
export default function getMaxFriendListCountBySteamLevel(level: number): number {
  return defaultFriendListCountConstant + level * 5;
}

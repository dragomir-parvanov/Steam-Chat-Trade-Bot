import { SteamId64 } from "../../models/types/SteamId64";

/**
 * Friends who are removed and are not subject to re-adding again from other profile.
 */
const g_removedFriendsNoReAdd = new Set<SteamId64>();

export default g_removedFriendsNoReAdd;

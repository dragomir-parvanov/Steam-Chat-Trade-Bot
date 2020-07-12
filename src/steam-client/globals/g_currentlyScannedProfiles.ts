import { SteamId64 } from "../../models/types/SteamId64";

/**
 * The profiles that are currently scanned.
 * This is to prevent a profile from being scanned twice the same time.
 */
const g_currentlyScannedProfiles: Set<SteamId64> = new Set();

export default g_currentlyScannedProfiles;

import { BehaviorSubject } from "rxjs";
import { SteamId64 } from "../../../../models/types/SteamId64";

/**
 * tracking steam cookies
 */
const g_steamCookies: Record<SteamId64, BehaviorSubject<string[] | null>> = {};

export default g_steamCookies;

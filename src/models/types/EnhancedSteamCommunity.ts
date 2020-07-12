import { PromisifiedSteamCommunity } from "./PromisifiedCommunity";
import { SteamId64 } from "./SteamId64";

import XMLParsedProfileModel from "../models/steam/steam-profiles/XMLParsedProfileModel";
import SteamID from "steamid";
import CEconItem from "../../declarations/steamcommunity/CEconItem";

/**
 * Enhanced steam community, which have mo
 */
export type EnhancedSteamCommunity = PromisifiedSteamCommunity & {
  getSteamUser: (partnerId: SteamId64 | SteamID, tries: number) => Promise<XMLParsedProfileModel>;
  getUserInventoryContents: (steamId: string | null, appId: number, contextId: number, tradableOnly: boolean, tries) => Promise<CEconItem[]>;
};

import TradeOfferManager from "steam-tradeoffer-manager";
import { PromisifiedSteamUser } from "../../models/types/PromisifiedSteamUser";
import { PromisifiedSteamCommunity } from "../../models/types/PromisifiedCommunity";
import { SteamId64 } from "../../models/types/SteamId64";

const g_steamInstancesStores: Record<SteamId64, SteamInstancesStore> = {};

export interface SteamInstancesStore {
  manager: TradeOfferManager;
  client: PromisifiedSteamUser;
  community: PromisifiedSteamCommunity;
}
export default g_steamInstancesStores;

import { SteamId64 } from "../../../../models/types/SteamId64";

export default interface SteamAccountProxyQuery {
  clientId: SteamId64;
  proxyUrl: SteamId64;
  refererUrl: SteamId64;
}

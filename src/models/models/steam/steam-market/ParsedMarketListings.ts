import AssetId from "../../../types/AssetId";
import ParsedItemOnMarket from "./ParsedItemOnMarket";
import { SteamId64 } from "../../../types/SteamId64";

export default interface ParsedMarketListings {
  eur: Record<AssetId, Record<SteamId64, ParsedItemOnMarket>>;
  usd: Record<AssetId, Record<SteamId64, ParsedItemOnMarket>>;
  rub: Record<AssetId, Record<SteamId64, ParsedItemOnMarket>>;
}

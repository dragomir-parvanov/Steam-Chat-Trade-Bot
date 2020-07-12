import AssetId from "../../../../types/AssetId";
import SteamItemAPIModel from "../../steam-items/steam-api/SteamItemAPIModel";

export interface AppIdsInAssetsSteamAPIModel extends Record<number, Record<AssetId, SteamItemAPIModel>> {}
export interface AssetsInGetMarketListingsSteamAPIModel extends Record<AssetId, AppIdsInAssetsSteamAPIModel> {}
export default interface GetMarketListingsSteamAPIModel {
  assets: AssetsInGetMarketListingsSteamAPIModel;
  hovers: string;
  results_html: string;
  total_count: number;
}

import XMLParsedProfileModel from "./XMLParsedProfileModel";
import ParsedItemModel from "../steam-items/ParsedItemModel";
import { SteamId64 } from "../../../types/SteamId64";
import SteamInventoryModel from "../steam-items/SteamInventoryModel";
import AssetId from "../../../types/AssetId";
import Identifiable from "../../../../data/identifiables/Identifiable";

/**
 * Adding inventory to @interface XMLParsedProfileModel
 * @export
 * @interface XMLParsedProfileWithInventoryModel
 * @extends {XMLParsedProfileModel}
 */
export default interface XMLParsedProfileWithInventoryModel extends XMLParsedProfileModel, Identifiable<SteamId64> {
  inventory: SteamInventoryModel;
  _id: SteamId64;
}

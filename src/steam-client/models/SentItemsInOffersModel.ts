import Identifiable from "../../data/identifiables/Identifiable";
import { SteamId64 } from "../../models/types/SteamId64";
import AssetId from "../../models/types/AssetId";

/**
 * Using it to track which items we have sent in the trade offers.
 * @export
 * @interface SentItemsInOffersModel
 */
export default interface SentItemsInOffersModel extends Identifiable {
  clientId: SteamId64;
  marketHashName: string;
  items: SentItemsModel[];
}

interface SentItemsModel {
  sentOn: Date;
  assetId: AssetId;
}

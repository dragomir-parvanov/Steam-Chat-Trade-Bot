import { SteamId64 } from "../../models/types/SteamId64";
import ParsedItemModel from "../../models/models/steam/steam-items/ParsedItemModel";
import SteamInventoryModel from "../../models/models/steam/steam-items/SteamInventoryModel";

const g_partnerInventories: Record<SteamId64, ParsedItemModel[]> = {};

export default g_partnerInventories;

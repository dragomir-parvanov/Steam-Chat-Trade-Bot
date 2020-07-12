import { SteamId64 } from "../../../../models/types/SteamId64";
import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";

const g_clientsInventories: g_clientsInventoriesType = {};

export default g_clientsInventories;

export type g_clientsInventoriesType = Record<SteamId64, ParsedItemModel[]>;

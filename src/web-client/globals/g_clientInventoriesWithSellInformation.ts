import { SteamId64 } from "../../models/types/SteamId64";
import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import UpdatingSubject from "../../classes/rxjs-extending/UpdatingSubject";

const g_clientInventoriesWithSellInformation: g_clientInventoriesWithSellInformationType = {};

type g_clientInventoriesWithSellInformationType = Record<SteamId64, UpdatingSubject<ParsedItemWithSellInformationModel[]>>;

export default g_clientInventoriesWithSellInformation;

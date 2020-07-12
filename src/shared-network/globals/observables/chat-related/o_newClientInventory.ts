import { Subject } from "rxjs";
import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import WithClientId from "../../../../models/templates/WithClientId";

const o_newClientInventory = new Subject<WithClientId<ParsedItemModel[]>>();

export default o_newClientInventory;

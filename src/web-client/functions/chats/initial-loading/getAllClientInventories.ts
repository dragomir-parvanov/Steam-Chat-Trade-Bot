import Axios from "axios";
import g_clientsInventories from "../../../../shared-network/globals/observables/chat-related/g_clientsInventories";
import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import RecordFunctions from "../../../../classes/RecordFunctions";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";

export default async function getAllClientInventories() {
  const response = await mainConnect.clients.inventories.getAllClientsInventories();
  return response;
}

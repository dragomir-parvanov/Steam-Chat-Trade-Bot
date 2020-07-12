import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import EHTTPMethods from "../../../../models/enums/EHTTPMethods";
import restartSteamChild from "../../../../main-server/src/functions/childs/restartSteamChild";
import checkUserClaims from "../../../../main-server/src/passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import startSteamClient from "../../../../steam-client/startSteamClient";
import stopSteamChild from "../../../../main-server/src/functions/childs/stopSteamChild";
import { fr_getSpecificClientInventory, fr_getAllClientInventories } from "../../../../main-server/src/routes/clients/clientInventoryRouter";
import { fr_updateClient, fr_addSteamClient, fr_getAllClients, fr_updateClientCredentials } from "../../../../main-server/src/routes/clients/clientRouter";
import createSteamChild from "../../../../main-server/src/functions/childs/createSteamChild";
import startAllAllowedToRunSteamChilds from "../../../../main-server/src/functions/childs/startAllAllowedToRunSteamChilds";

const main_clientFurorRouter = validateType<ExpressFunctionRouter>()({
  startAllAllowedToRunSteamChilds: {
    type: EHTTPMethods.patch,
    func: startAllAllowedToRunSteamChilds,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  restartClient: {
    type: EHTTPMethods.patch,
    func: restartSteamChild,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  startClient: {
    type: EHTTPMethods.patch,
    func: createSteamChild,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  stopClient: {
    type: EHTTPMethods.patch,
    func: stopSteamChild,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  updateClient: {
    type: EHTTPMethods.patch,
    func: fr_updateClient,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  addClient: {
    type: EHTTPMethods.post,
    func: fr_addSteamClient,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  getAllClients: {
    type: EHTTPMethods.get,
    func: fr_getAllClients,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  updateCredentials: {
    type: EHTTPMethods.patch,
    func: fr_updateClientCredentials,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
  },
  inventories: {
    getClientInventory: {
      type: EHTTPMethods.get,
      func: fr_getSpecificClientInventory,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement, ERegisteredUserClaim.ChatPage)],
    },
    getAllClientsInventories: {
      type: EHTTPMethods.get,
      func: fr_getAllClientInventories,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement, ERegisteredUserClaim.ChatPage)],
    },
  },
});

export default main_clientFurorRouter;

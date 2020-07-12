import DbServiceBase from "../data/services/Base/DbServiceBase";
import SteamClientModel from "../models/models/steam/steam-profiles/SteamClientModel";
import { EMongoDbCollectionNames } from "../data/EMongoDbCollectionNames";
import CriticalLogError from "../classes/errors/base/CriticalLogError";
import steamUserLogin from "./steam-login/user/steamUserLogin";
import createSteamCommunity from "./steam-login/community/createSteamCommunity";
import createTradeOfferManager from "./steam-login/manager/createTradeOfferManager";
import initializeCookieConfigurator from "./steam-login/user/config/functions/initializeCookieConfigurator";
import initializeSteamUserEventHandler from "./functions/event-handlers/initializeSteamUserEventHandler";
import initializeSteamCommunityEventHandler from "./functions/event-handlers/initializeSteamCommunityEventHandler";
import initializeTradeOfferManagerEventHandler from "./functions/event-handlers/initializeTradeOfferManagerEventHandler";
import SteamClientDbService from "../data/services/SteamClientDbService";
import startScanningSchedule from "./functions/scanning/startScanningSchedule";
import childPrivacySet from "./functions/childPrivacySet";
import { SteamId64 } from "../models/types/SteamId64";
import g_steamInstancesStores from "./globals/g_steamInstancesStores";
import SteamCommunityFunctions from "../functions/steam/steam-community/SteamCommunityFunctions";
import o_newClientInventory from "../shared-network/globals/observables/chat-related/o_newClientInventory";
import g_steamCookies from "./steam-login/user/config/g_steamCookies";
import { BehaviorSubject } from "rxjs";
import { PromisifiedSteamCommunity } from "../models/types/PromisifiedCommunity";
import { CoreOptions } from "request";
import LogError from "../classes/errors/base/LogError";
import sellItemsInClientInventoryFromSellOrder from "./functions/market/sellItemsInClientInventoryFromSellOrder";
import g_marketSellOrders from "../main-server/src/globals/g_marketSellOrders";
import g_marketStatus from "../main-server/src/globals/g_marketStatus";

/**
 * Starts the steam client
 * @export
 * @returns {Promise<number>} Friend list count of the client
 */
export default async function startSteamClient(clientId: SteamId64): Promise<number> {
  console.log("Starting client with", clientId);

  g_steamCookies[clientId] = new BehaviorSubject(null as any);

  const dbService = new DbServiceBase<SteamClientModel>(EMongoDbCollectionNames.SteamClients);
  const client = await dbService.findOne(clientId);

  if (!client) {
    throw new CriticalLogError(`Client with steamid 64 ${clientId} is not found`);
  }

  const user = await steamUserLogin(client);

  const community = createSteamCommunity(client);
  const manager = await createTradeOfferManager(clientId, user, community);
  g_steamInstancesStores[clientId] = { client: user, community, manager };
  initializeCookieConfigurator(clientId, community, manager);

  // removed 22.5.2020
  //manager.doPoll();

  const communityFunctions = new SteamCommunityFunctions(clientId);
  const clientItems = await communityFunctions.getMyInventory();
  o_newClientInventory.next({ clientId, data: clientItems });

  initializeSteamUserEventHandler(clientId, user, community, manager);
  initializeSteamCommunityEventHandler(clientId, user, community, manager);
  initializeTradeOfferManagerEventHandler(clientId, user, community, manager);

  childPrivacySet(community);
  startScanningSchedule(clientId, user);
  const clientDb = new SteamClientDbService();
  const friends = await clientDb.updateFriendList(clientId, user.myFriends);

  return Object.keys(friends).length;
}

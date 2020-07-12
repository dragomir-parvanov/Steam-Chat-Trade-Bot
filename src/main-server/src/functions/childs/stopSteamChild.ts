import { SteamId64 } from "../../../../models/types/SteamId64";
import g_clientWorkersInformation from "../../globals/g_clientWorkersInformation";
import LogError from "../../../../classes/errors/base/LogError";
import g_steamInstancesStores from "../../../../steam-client/globals/g_steamInstancesStores";

export default function stopSteamChild(clientId: SteamId64) {
  const client = g_clientWorkersInformation[clientId];
  if (!client) {
    throw new LogError(`Client with id ${clientId} is not created to be deleted`);
  }

  client.isRunning = false;
  const store = g_steamInstancesStores[clientId];
  store.client.logOff();
  delete store.client;
  delete store.community;
  delete store.manager;

  delete g_steamInstancesStores[clientId];
  delete g_clientWorkersInformation[clientId];
}

import { SteamId64 } from "../../../../models/types/SteamId64";
import SteamClientDbService from "../../../../data/services/SteamClientDbService";
import g_clientWorkersInformation from "../../globals/g_clientWorkersInformation";
import LogError from "../../../../classes/errors/base/LogError";
import getMaxFriendListCountBySteamLevel from "../../../../functions/steam/getMaxFriendListCountBySteamLevel";

import createClientBindedRoutes from "../../../../shared-network/client-bind/createClientBindedRoutes";
import g_clientWorkersImplementation from "../../globals/g_clientWorkersImplementation";

export default async function createSteamChild(clientId: SteamId64) {
  if (g_clientWorkersInformation[clientId]) {
    throw new LogError(`Client with id ${clientId} is already created`);
  }

  console.log("starting client");

  const db = new SteamClientDbService();

  const client = await db.findOne(clientId, { friends: 0 });

  if (!client) {
    throw new LogError(`No client found for id ${clientId}`);
  }

  g_clientWorkersInformation[clientId] = {
    friendListCount: 0,
    isRunning: false,
    ...client,
    maxFriendListCount: getMaxFriendListCountBySteamLevel(client.level),
    hasCrashed: false,
  };
  const functions = createClientBindedRoutes(clientId);

  const friendListCount = await functions.startClient();
  console.log("frient list count", friendListCount);

  g_clientWorkersImplementation[clientId] = {
    clientId,
    functions,
  };
  g_clientWorkersInformation[clientId].friendListCount = friendListCount;
  g_clientWorkersInformation[clientId].isRunning = true;
}

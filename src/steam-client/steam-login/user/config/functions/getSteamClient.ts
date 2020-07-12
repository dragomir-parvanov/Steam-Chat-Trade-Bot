import { SteamId64 } from "../../../../../models/types/SteamId64";
import SteamClientModel from "../../../../../models/models/steam/steam-profiles/SteamClientModel";
import DbServiceBase from "../../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../../data/EMongoDbCollectionNames";
import LogError from "../../../../../classes/errors/base/LogError";

export default async function getSteamClient(clientId: SteamId64): Promise<SteamClientModel> {
  const service = new DbServiceBase<SteamClientModel>(EMongoDbCollectionNames.SteamClients);
  const client = await service.findOne(clientId);
  if (!client) {
    throw new LogError(`There is no steam client with steamid64 ${clientId}`, 5);
  }

  return client;
}

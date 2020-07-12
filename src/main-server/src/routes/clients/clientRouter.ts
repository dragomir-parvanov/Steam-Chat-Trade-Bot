import g_clientWorkersInformation from "../../globals/g_clientWorkersInformation";
import SteamClientDbService from "../../../../data/services/SteamClientDbService";
import WorkerClientModel from "../../../../models/WorkerClientModel";
import { SteamId64 } from "../../../../models/types/SteamId64";
import SteamClientModel from "../../../../models/models/steam/steam-profiles/SteamClientModel";
import SteamClientCredentialsModel from "../../../../models/models/steam/steam-profiles/SteamClientCredentialsModel";
import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";

import getMaxFriendListCountBySteamLevel from "../../../../functions/steam/getMaxFriendListCountBySteamLevel";

import EncryptedEntity from "../../../../models/templates/EncryptedEntity";
import encryptSteamCredentials from "../../../../functions/encryption/steamCredentialsEncryption";

export async function fr_updateClient(client: SteamClientModel) {
  const db = new SteamClientDbService();
  await db.updateOne(client._id, { $set: client });
  delete client.friends;
  const worker = g_clientWorkersInformation[client._id];
  if (worker) Object.assign(worker, client);
}

export async function fr_addSteamClient(client: SteamClientModel, credentials: SteamClientCredentialsModel) {
  const db = new SteamClientDbService();
  const credentialsDb = new DbServiceBase<EncryptedEntity<SteamClientCredentialsModel>>(EMongoDbCollectionNames.SteamClientsCredentials);

  await db.insertOne(client);

  await credentialsDb.insertOne(encryptSteamCredentials(credentials));
}

export async function fr_getAllClients() {
  const db = new SteamClientDbService();
  const copyOfWorkers = { ...g_clientWorkersInformation };

  const exist = Object.keys(copyOfWorkers);

  const cursor = db.findMany({ _id: { $nin: exist } });
  const notCachedUsers = await cursor.toArray();
  const notCachedUserObj: Record<SteamId64, WorkerClientModel> = {};
  notCachedUsers.forEach((u: SteamClientModel) => {
    const count = Object.keys(u.friends).length;
    delete u.friends;
    notCachedUserObj[u._id] = { ...u, hasCrashed: false, friendListCount: count, isRunning: false, maxFriendListCount: getMaxFriendListCountBySteamLevel(u.level) };
  });

  Object.assign(copyOfWorkers, notCachedUserObj);
  return Object.values(copyOfWorkers);
}

export async function fr_updateClientCredentials(clientId: SteamId64, credentials: SteamClientCredentialsModel) {
  const db = new DbServiceBase<EncryptedEntity<SteamClientCredentialsModel>>(EMongoDbCollectionNames.SteamClientsCredentials);
  await db.updateOne(clientId, { $set: encryptSteamCredentials(credentials) });
}

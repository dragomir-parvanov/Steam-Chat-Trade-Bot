import { SteamId64 } from "../../../../../models/types/SteamId64";
import SteamClientCredentialsModel from "../../../../../models/models/steam/steam-profiles/SteamClientCredentialsModel";
import CriticalLogError from "../../../../../classes/errors/base/CriticalLogError";
import DbServiceBase from "../../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../../data/EMongoDbCollectionNames";
import g_clientsIdentitySecrets from "../../../../globals/g_clientsIdentitySecrets";
import EncryptedEntity from "../../../../../models/templates/EncryptedEntity";
import { decryptSteamCredentials } from "../../../../../functions/encryption/steamCredentialsEncryption";

export default async function getSteamClientCredentials(clientId: SteamId64): Promise<SteamClientCredentialsModel> {
  //const credentials = testCredentials.find((c) => c._id === clientId);

  const db = new DbServiceBase<EncryptedEntity<SteamClientCredentialsModel>>(EMongoDbCollectionNames.SteamClientsCredentials);

  const encryptedCredentials = await db.findOne(clientId);

  if (!encryptedCredentials) {
    throw new CriticalLogError("no credentials found for steamid " + clientId);
  }

  const credentials = decryptSteamCredentials(encryptedCredentials);
  for (const key in credentials) {
    if (typeof credentials[key] === "string") {
      // removing whitespeaces, no password or shared secret is valid if it have whitespaces at the end or the beggining of it
      credentials[key] = credentials[key].trim();
    }
  }
  g_clientsIdentitySecrets[clientId] = credentials.identitySecret;

  return credentials;
}

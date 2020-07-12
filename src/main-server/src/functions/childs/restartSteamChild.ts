import { SteamId64 } from "../../../../models/types/SteamId64";
import g_clientWorkersInformation from "../../globals/g_clientWorkersInformation";
import LogError from "../../../../classes/errors/base/LogError";
import createSteamChild from "./createSteamChild";
import stopSteamChild from "./stopSteamChild";

/**
 * Restarts the steam client child if it was created in the first place.
 * @param clientId
 */
export default async function restartSteamChild(clientId: SteamId64): Promise<void> {
  stopSteamChild(clientId);

  await createSteamChild(clientId);
}

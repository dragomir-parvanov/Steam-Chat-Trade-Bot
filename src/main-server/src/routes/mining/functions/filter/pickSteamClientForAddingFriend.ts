import SteamClientDbService from "../../../../../../data/services/SteamClientDbService";
import getMaxFriendListCountBySteamLevel from "../../../../../../functions/steam/getMaxFriendListCountBySteamLevel";
import { FilterQuery } from "mongodb";
import LogError from "../../../../../../classes/errors/base/LogError";
import SteamClientModel from "../../../../../../models/models/steam/steam-profiles/SteamClientModel";
import g_clientWorkersInformation from "../../../../globals/g_clientWorkersInformation";
import ImplementedWorkerClientModel from "../../../../models/ImplementedWorkerClientModel";
import g_clientWorkersImplementation from "../../../../globals/g_clientWorkersImplementation";

/**
 * Picking a steam client that is running and its allowed to scan.
 * Also his friend list should have space for that account.
 * @deprecated
 * @export
 * @param {number} tier
 * @returns {Promise<SteamClientModel>}
 */
export default async function pickSteamClientForAddingFriend_deprecated(tier: number): Promise<SteamClientModel> {
  const dbService = new SteamClientDbService();
  /**
   *  checking if the friend list is full.
   * @param profile
   */
  const whereFunction = (profile: SteamClientModel): boolean => {
    const count = Object.keys(profile.friends).length;
    const maxProfileCount = getMaxFriendListCountBySteamLevel(profile.level);
    if (count >= maxProfileCount) {
      return false;
    } else {
      return true;
    }
  };

  const query: FilterQuery<SteamClientModel> = {
    isAllowedToRun: true,
    isAllowedToAddFriends: true,
    tier: { $lte: tier },
    $where: whereFunction,
  };

  const client = await dbService.findOne(query);
  if (!client) {
    // if we dont find a profile with a lower or the same tier, find a bigger tier
    const query: FilterQuery<SteamClientModel> = {
      isAllowedToRun: true,
      isAllowedToAddFriends: true,
      tier: { $gt: tier },
      $where: whereFunction,
    };
    const client = await dbService.findOne(query);
    if (!client) {
      throw new LogError("Could't find a single client that is running, it is allowed to add, and it haves space in the friend list");
    }
    return client;
  }

  return client;
}

export function pickSteamClientForAddingFriend_new(tier: number): ImplementedWorkerClientModel {
  const clients = Object.values(g_clientWorkersInformation)
    .filter((c) => c.isAllowedToAddFriends && c.isAllowedToRun && c.isRunning && !c.hasScamAlert && getMaxFriendListCountBySteamLevel(c.level) > c.friendListCount)
    .sort((a, b) => a.friendListCount - b.friendListCount);
  if (clients.length === 0) {
    // TODO add friend to the db
    throw new LogError("No client that is either running or eligible to add friends");
  }

  const closestToNeededTier = clients.reduceRight((a, b) => {
    let aDiff = Math.abs(a.tier - tier);
    let bDiff = Math.abs(b.tier - tier);

    if (aDiff == bDiff) {
      return a > b ? a : b;
    } else {
      return bDiff < aDiff ? b : a;
    }
  });

  const implementedWorker = g_clientWorkersImplementation[closestToNeededTier._id];

  if (!implementedWorker) {
    throw new LogError(`Worker information exists, but implementation is missing ${closestToNeededTier._id}`);
  }
  closestToNeededTier.friendListCount++;
  console.log("picked client with name", closestToNeededTier.nickname);
  return implementedWorker;
}

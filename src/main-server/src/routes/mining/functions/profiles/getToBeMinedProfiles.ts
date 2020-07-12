import ToBeMinedProfileModel from "../../../../../../models/models/steam/steam-profiles/ToBeMinedProfileModel";

import DbServiceBase from "../../../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../../../data/EMongoDbCollectionNames";
import { toBeScannedProfileWaitOnEmptyTimeConstant } from "../../config/toBeScannedProfileWaitOnEmptyTimeConstant";
import { profilesBatchConstant } from "../../config/profilesBatchConstant";
import { BulkWriteOperation } from "mongodb";

const toBeScannedProfileService = new DbServiceBase<ToBeMinedProfileModel>(EMongoDbCollectionNames.ToBeMinedProfiles);

const forbidScanning = new Date();

/**
 * Getting profiles that are now eligible to be mined again.
 * If no eligible profiles are found, this method will return empty arrays for @constant toBeScannedProfileWaitOnEmptyTimeConstant time.
 * @export
 * @returns {Promise<ToBeMinedProfileModel[]>}
 */
export async function getToBeMinedProfiles(): Promise<ToBeMinedProfileModel[]> {
  if (new Date() < forbidScanning) {
    // We dont want to spam the database with where clauses.
    return [];
  }

  const toBeScannedProfilesAgainCursor = toBeScannedProfileService.findMany({
    forwarded: false,
    $where: function () {
      const rescanAfterDate = this.addedOn as Date;
      rescanAfterDate.setDate(rescanAfterDate.getDate() + (this.toBeMinedAfterDays as number));
      return new Date() >= rescanAfterDate;
    },
  });

  const toBeScannedProfilesAgain = await toBeScannedProfilesAgainCursor.limit(profilesBatchConstant).toArray();

  if (toBeScannedProfilesAgain.length < profilesBatchConstant) {
    forbidScanning.setHours(forbidScanning.getHours() + toBeScannedProfileWaitOnEmptyTimeConstant);
  }

  const updateQuery = { _id: { $in: toBeScannedProfilesAgain.map((p) => p._id) } };
  await toBeScannedProfileService.updateMany(updateQuery, { $set: { forwarded: true } });

  return toBeScannedProfilesAgain;
}

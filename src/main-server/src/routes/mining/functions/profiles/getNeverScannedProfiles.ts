import DbServiceBase from "../../../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../../../data/EMongoDbCollectionNames";
import NeverScannedProfileModel from "../../../../../../models/models/steam/steam-profiles/NeverScannedProfileModel";

export default async function getNeverScannedProfiles(count: number) {
  const db = new DbServiceBase<NeverScannedProfileModel>(EMongoDbCollectionNames.NeverScannedProfiles);

  const cursor = db.findMany({ forwarded: false }, { _id: 1 });
  const profiles = await cursor.limit(count).toArray();

  // setting that these profiles are forwarded.
  const updateQuery = { _id: { $in: profiles.map((p) => p._id) } };
  await db.updateMany(updateQuery, { $set: { forwarded: true } });

  return profiles;
}

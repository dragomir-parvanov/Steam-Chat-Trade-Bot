import DbServiceBase from "./Base/DbServiceBase";
import ToBeAddedProfileModel from "../../models/models/steam/steam-profiles/ToBeAddedProfileModel";
import { EMongoDbCollectionNames } from "../EMongoDbCollectionNames";
import MinedProfileModel from "../../models/models/steam/steam-profiles/MinedProfileModel";
import { SteamId64 } from "../../models/types/SteamId64";

export default class ToBeAddedProfilesDbService extends DbServiceBase<ToBeAddedProfileModel> {
  constructor() {
    super(EMongoDbCollectionNames.ToBeAddedProfiles);
  }

  addProfile = async (clientId: SteamId64, partnerId: SteamId64) => {
    const exist = await this.findMany([partnerId]).count();
    if (exist) {
      await this.updateOne(partnerId, { $push: { wasAddedBy: clientId } });
    } else {
      const entity: ToBeAddedProfileModel = { _id: partnerId, wasAddedBy: [clientId] };
      await this.insertOne(entity);
    }
  };
}

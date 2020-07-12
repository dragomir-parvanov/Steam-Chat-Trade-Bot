import DbServiceBase from "./Base/DbServiceBase";
import { SteamId64 } from "../../models/types/SteamId64";
import ToBeScannedProfileModel from "../../steam-client/models/ToBeScannedProfileModel";
import { EMongoDbCollectionNames } from "../EMongoDbCollectionNames";

export default class PartnerScanningDbService extends DbServiceBase<ToBeScannedProfileModel> {
  constructor() {
    super(EMongoDbCollectionNames.ToBeScannedProfiles);
  }
  async rescanAfterDays(partnerId: SteamId64, days: number): Promise<void> {
    const profile: ToBeScannedProfileModel = {
      _id: partnerId,
      addedOn: new Date(),
      toBeScannedAfterDays: days,
    };
    await this.updateOne(partnerId, { $set: profile }, { upsert: true });
  }
  async isPartnerEligibleForScanning(partnerId: SteamId64): Promise<boolean> {
    const doc = await this.findOne(partnerId);

    if (!doc) {
      return true;
    }
    const d = doc.addedOn;
    const dueDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    dueDate.setDate(dueDate.getDate() + doc.toBeScannedAfterDays);
    if (dueDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}

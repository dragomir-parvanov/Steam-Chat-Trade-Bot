import { clearSchemaTesting } from "../clearSchema/clearSchema";
import NeverScannedProfileModel from "../../../models/models/steam/steam-profiles/NeverScannedProfileModel";

function NeverScannedProfileSchema(profile: NeverScannedProfileModel) {
  const test: clearSchemaTesting<object> = {};

  for (const key in profile) {
    test[key](profile[key]);
  }
}

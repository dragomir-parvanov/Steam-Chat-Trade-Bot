import XMLParsedProfileModel from "../../../models/models/steam/steam-profiles/XMLParsedProfileModel";
import chance from "../../../functions/chance";
import SteamID from "steamid";
import { EPrivacyState } from "../../../models/enums/EPrivacyState";
export default function generateRandomXMLParsedProfile(): XMLParsedProfileModel {
  const profile: XMLParsedProfileModel = {
    name: chance.name(),
    steamID: Object as any,
    privacyState: EPrivacyState.FriendsOnly,
    summary: chance.color(),
    isLimitedAccount: Math.random() > 0.5,
    visibilityState: "not implemented",
    vacBanned: Math.random() > 0.8,
    tradeBanState: "not implemented",
    location: chance.country(),
    memberSince: chance.date(),
  };

  return profile;
}

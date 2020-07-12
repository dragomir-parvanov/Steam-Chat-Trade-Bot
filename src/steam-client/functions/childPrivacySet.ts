import SteamCommunity from "steamcommunity";
import { EPrivacyState } from "../../models/enums/EPrivacyState";
import ProfileSettingsModel from "../../declarations/steamcommunity/ProfileSettingsModel";

export default function childPrivacySet(community: SteamCommunity) {
  const SETTINGS: Partial<ProfileSettingsModel> = {
    profile: EPrivacyState.Public,
    inventory: EPrivacyState.Private,
    gameDetails: EPrivacyState.Public,
    playtime: true,
    friendsList: EPrivacyState.Public,
  };
  return new Promise((resolve, reject) => {
    community.profileSettings(SETTINGS, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

import { EPrivacyState } from "../../models/enums/EPrivacyState";

export default interface ProfileSettingsModel {
  profile: EPrivacyState;
  comments: EPrivacyState;
  inventory: EPrivacyState;
  inventoryGifts: boolean;
  gameDetails: EPrivacyState;
  playtime: boolean;
  friendsList: EPrivacyState;
}

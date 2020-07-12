import { EPrivacyState } from "../../../enums/EPrivacyState";
import SteamID from "steamid";

export default interface XMLParsedProfileModel {
  /**
   * The steam id class.
   * @type {SteamID}
   * @memberof XMLParsedProfileModel
   */
  steamID: SteamID;

  /**
   * The name of the profile.
   * @type {string}
   * @memberof XMLParsedProfileModel
   */
  name: string;

  /**
   * If the profile is vac banned, this is true, otherwise false.
   * @type {boolean}
   * @memberof XMLParsedProfileModel
   */
  vacBanned: boolean;

  /**
   * If the profile is limited, this is true, otherwise false.
   * a limited profile cannot sell on market and add friends.
   * @type {boolean}
   * @memberof XMLParsedProfileModel
   */
  isLimitedAccount: boolean;

  /**
   * The trade ban state of the profile.
   * @type {string}
   * @memberof XMLParsedProfileModel
   */
  tradeBanState: string;

  /**
   * The privacy status of the profile.
   * @type {EPrivacyState}
   * @memberof XMLParsedProfileModel
   */
  privacyState: EPrivacyState;

  /**
   * The visibility state of the profile.
   * @type {string}
   * @memberof XMLParsedProfileModel
   */
  visibilityState: string;

  //#region if the visibility state is 3, this can be retrieved.

  /**
   * When the profile was created.
   * @type {Date}
   * @memberof XMLParsedProfileModel
   */
  memberSince?: Date;

  /**
   * The location that the profile have set.
   * @type {string}
   * @memberof XMLParsedProfileModel
   */
  location?: string;

  /**
   * The real name shown on the profile.
   * @type {string}
   * @memberof XMLParsedProfileModel
   */
  realName?: string;

  /**
   * The summary of the profile
   * located at the top of the profile if its being viewed in the browser.
   * @type {string}
   * @memberof XMLParsedProfileModel
   */
  summary?: string;
  //#endregion
}

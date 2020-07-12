import MinedProfileModel from "./MinedProfileModel";
import Forwardable from "../../../interfaces/Forwardable";

/**
 * Profile which needs to be scanned again.
 * @export
 * @interface ToBeScannedProfileModel
 * @extends {MinedProfileModel}
 */
export default interface ToBeMinedProfileModel extends MinedProfileModel, Forwardable {
  /**
   * To be scanned after n days after the addedOn date.
   * @type {number}
   * @memberof ToBeScannedProfileModel
   */
  toBeMinedAfterDays: number;
}

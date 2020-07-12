import XMLParsedProfileWithInventoryModel from "./XMLParsedProfileWithInventoryModel";
import FromCSGOGroup from "../../../interfaces/FromCSGOGroup";

/**
 * A profile which is scanned.
 * @export
 * @interface ScannedProfileModel
 * @extends {XMLParsedProfileWithInventoryModel}
 * @extends {NeverScannedProfileModel}
 */
export default interface MinedProfileModel extends XMLParsedProfileWithInventoryModel, FromCSGOGroup {
  addedOn: Date;
}

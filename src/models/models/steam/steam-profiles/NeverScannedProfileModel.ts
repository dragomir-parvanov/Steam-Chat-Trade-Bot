import Forwardable from "../../../interfaces/Forwardable";
import { SteamId64 } from "../../../types/SteamId64";
import Identifiable from "../../../../data/identifiables/Identifiable";
import FromCSGOGroup from "../../../interfaces/FromCSGOGroup";

/**
 * Profile which is never scanned
 * @export
 * @interface NeverScannedProfileModel
 * @extends {Forwardable}
 * @extends {Identifiable<SteamId64>}
 */
export default interface NeverScannedProfileModel extends Forwardable, Identifiable<SteamId64>, FromCSGOGroup {
  _id: SteamId64;
}

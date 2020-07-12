import { SteamId64 } from "../../models/types/SteamId64";
import Identifiable from "../../data/identifiables/Identifiable";

export default interface ToBeScannedProfileModel extends Identifiable<SteamId64> {
  _id: SteamId64;
  addedOn: Date;
  toBeScannedAfterDays: number;
}

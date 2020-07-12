import MinedProfileModel from "./MinedProfileModel";
import { SteamId64 } from "../../../types/SteamId64";
import Identifiable from "../../../../data/identifiables/Identifiable";

export default interface ToBeAddedProfileModel extends Identifiable<SteamId64> {
  _id: SteamId64;
  /**
   * From which profiles this partner was already added
   */
  wasAddedBy: SteamId64[];
}

import SteamClientModel from "./SteamClientModel";
import Identifiable from "../../../../data/identifiables/Identifiable";
import { SteamId64 } from "../../../types/SteamId64";

export default interface SteamClientCredentialsModel extends Identifiable<SteamId64> {
  _id: SteamId64;
  username: string;
  password: string;
  identitySecret: string;
  sharedSecret: string;
}

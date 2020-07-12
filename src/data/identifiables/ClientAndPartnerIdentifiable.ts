import Identifiable from "./Identifiable";
import { SteamId64 } from "../../models/types/SteamId64";

export default interface ClientAndPartnerIdentifiable extends Identifiable {
  _id: string;
  clientId: SteamId64;
  partnerId: SteamId64;
}

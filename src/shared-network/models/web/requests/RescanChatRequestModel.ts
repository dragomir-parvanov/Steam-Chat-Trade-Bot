import { SteamId64 } from "../../../../models/types/SteamId64";
import ClientAndPartnerIdentfiables from "../../../../models/interfaces/ClientAndPartnerIdentfiables";

export default interface RescanChatRequestModel extends ClientAndPartnerIdentfiables {
  rescanAfterDays: number;
}

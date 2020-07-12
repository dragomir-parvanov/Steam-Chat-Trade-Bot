import { SteamId64 } from "../../../models/types/SteamId64";
import SteamUser from "steam-user";
import { isPersonaStateEligibleForScanning } from "./isPersonaStateEligibleForScanning";
import PartnerScanningDbService from "../../../data/services/PartnerScanningDbService";
import createDoubleIdentification from "../../../functions/doubleIdentification";
import g_activeChats from "../../../shared-network/globals/observables/chat-related/g_activeChats";

const scanningService = new PartnerScanningDbService();

export default async function isProfileEligibleForScanning(clientId: SteamId64, partnerId: SteamId64, client: SteamUser) {
  const id = createDoubleIdentification(clientId, partnerId);
  if (!g_activeChats[id]) {
    if (isPersonaStateEligibleForScanning(client.users[partnerId].persona_state)) {
      const eligble = await scanningService.isPartnerEligibleForScanning(partnerId);
      return eligble;
    }
  }
}

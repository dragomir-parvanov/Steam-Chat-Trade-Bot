import { SteamId64 } from "../../../../../models/types/SteamId64";
import createDoubleIdentification from "../../../../../functions/doubleIdentification";
import AtLeast from "../../../../../models/types/AtLeast";
import ActiveChatModel from "../../../../../models/ActiveChatModel";
import g_activeChats from "../../../../../shared-network/globals/observables/chat-related/g_activeChats";
import o_chatUpdate from "../../../../../shared-network/globals/observables/chat-related/o_chatUpdate";
import { userType } from "../../../../../declarations/steam-user/userType";
import { EPersonaState } from "../../../../../declarations/steam-user/EPersonaState";

export default function handleNewSteamUserStatus(clientId: SteamId64, partnerId: SteamId64, user: userType) {
  const id = createDoubleIdentification(clientId, partnerId);
  const update: AtLeast<ActiveChatModel, "clientId" | "partnerId"> = { clientId, partnerId };

  const chat = g_activeChats[id];
  if (!chat) {
    return;
  }
  let { persona_state: personaState } = user;

  if (personaState == null) {
    personaState = EPersonaState.Offline;
  }

  update.personaState = personaState;

  if (personaState !== chat.personaState) {
    o_chatUpdate.next(update);
  }
}

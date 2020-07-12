import { SteamId64 } from "../../../models/types/SteamId64";
import createDoubleIdentification from "../../../functions/doubleIdentification";
import generateRandomMessage from "./generateRandomMessage";
import g_chatMessages from "../../globals/g_chatMessages";

export default function generateStreamMessages(clientId: SteamId64, partnerId: SteamId64) {
  const id = createDoubleIdentification(clientId, partnerId);

  setInterval(() => {
    const message = generateRandomMessage(clientId, partnerId);
    g_chatMessages[id].new.update((prev) => [...prev, message]);
  }, 500);
}

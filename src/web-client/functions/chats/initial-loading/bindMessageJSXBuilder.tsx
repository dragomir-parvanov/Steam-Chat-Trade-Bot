import { SteamId64 } from "../../../../models/types/SteamId64";
import g_chatMessages from "../../../globals/g_chatMessages";
import createDoubleIdentification from "../../../../functions/doubleIdentification";
import pushJSXMessage, { createJSXMessage } from "../pushJSXMessage";
import g_chatMessagesJSX, { MessageOriginModelJSX } from "../../../globals/g_chatMessagesJSX";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";
import SteamChatMessageModel from "../../../../models/models/chats/SteamChatMessageModel";
import { skip, filter } from "rxjs/operators";
import LogError from "../../../../classes/errors/base/LogError";

const alreadySet = new Set<string>();
export default function bindMessageJSXBuilder(clientId: SteamId64, partnerId: SteamId64) {
  const id = createDoubleIdentification(clientId, partnerId);
  if (alreadySet.has(id)) {
    return;
  } else {
    alreadySet.add(id);
  }
  if (!g_chatMessages[id]) {
    g_chatMessages[id] = { previous: [], new: new UpdatingSubject<SteamChatMessageModel[]>([]) };
  }
  const messages = g_chatMessages[id];
  if (!messages) {
    throw new LogError(`Messages with id ${id} are not found`);
  }
  const JSXMessages: MessageOriginModelJSX = {
    new: new UpdatingSubject<JSX.Element[]>([]),
    previous: [],
  };
  g_chatMessagesJSX[id] = JSXMessages;
  let cachedPreviousMessage: SteamChatMessageModel;
  messages.previous.forEach((m, i) => pushJSXMessage(id, m, m[i - 1]));
  g_chatMessages[id].new.pipe(filter((m) => m.length > 0)).subscribe({
    next: (m) => {
      const cachedLevelSubscription = cachedPreviousMessage;

      const lastIndex = m.length - 1;
      const newMessage = m[lastIndex];
      cachedPreviousMessage = newMessage;
      pushJSXMessage(id, newMessage, cachedLevelSubscription, true);
    },
  });
}

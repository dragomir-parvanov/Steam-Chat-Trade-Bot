import createDoubleIdentification from "../../../../functions/doubleIdentification";
import g_chatMessages from "../../../globals/g_chatMessages";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import log from "../../../../classes/logger/Log";
import StackTrace from "../../../../classes/errors/StackTrace";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";
import SteamChatMessageModel from "../../../../models/models/chats/SteamChatMessageModel";

export default async function getAndSetAllMessages(beforeTime: number) {
  //const messages = await mainConnect.chats.messages.getAllMessages(beforeTime);
  const messages = await mainConnect.chats.messages.getAllMessages();

  messages.forEach((m) => {
    const id = createDoubleIdentification(m.clientId, m.partnerId);
    if (id === "76561198203198914-76561198969756430") {
      console.log("ID IS MET");
    }
    const messages = g_chatMessages[id];
    if (!messages) {
      g_chatMessages[id] = {
        previous: [],
        new: new UpdatingSubject<SteamChatMessageModel[]>([]),
      };
    }
    g_chatMessages[id].previous.push(m);
  });
  return messages;
}

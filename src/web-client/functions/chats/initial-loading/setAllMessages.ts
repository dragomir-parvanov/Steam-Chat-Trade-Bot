import Axios from "axios";
import ActiveChatModel from "../../../../models/ActiveChatModel";
import g_activeChats from "../../../../shared-network/globals/observables/chat-related/g_activeChats";
import RecordFunctions from "../../../../classes/RecordFunctions";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";
import createDoubleIdentification from "../../../../functions/doubleIdentification";
import g_chatMessages from "../../../globals/g_chatMessages";
import SteamChatMessageModel from "../../../../models/models/chats/SteamChatMessageModel";
import g_chatMessagesJSX from "../../../globals/g_chatMessagesJSX";
import g_clientActiveChats from "../../../globals/g_clientActiveChats";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import createClientActiveChat from "../../../factories/createClientActiveChat";

/**
 *Getting all chats and setting them to the g_clientActiveChats
 * CAUTION! Item sell information is not here.
 * you need to call initializeItemsPriceSchema after this
 * @export
 */
export default function setAllMessages(chats: ActiveChatModel[]) {
  chats.forEach((c) => {
    c.addedOn = new Date(c.addedOn);
    if (c.partnerProfile.memberSince) c.partnerProfile.memberSince = new Date(c.partnerProfile.memberSince);
    const id = createDoubleIdentification(c.clientId, c.partnerId);
    g_clientActiveChats[id] = new UpdatingSubject(createClientActiveChat(c));
    g_chatMessages[id] = {
      previous: [],
      new: new UpdatingSubject<SteamChatMessageModel[]>([]),
    };
    g_chatMessagesJSX[id] = {
      previous: [],
      new: new UpdatingSubject<JSX.Element[]>([]),
    };
  });

  return chats;
}

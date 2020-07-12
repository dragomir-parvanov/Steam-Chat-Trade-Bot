import SteamChatMessageModel from "../../models/models/chats/SteamChatMessageModel";
import { Subject } from "rxjs";
import UpdatingSubject from "../../classes/rxjs-extending/UpdatingSubject";

const g_chatMessages: g_chatMessagesType = {};

type g_chatMessagesType = Record<string, MessageOriginModel>;

interface MessageOriginModel {
  previous: SteamChatMessageModel[];
  new: UpdatingSubject<SteamChatMessageModel[]>;
}

export default g_chatMessages;

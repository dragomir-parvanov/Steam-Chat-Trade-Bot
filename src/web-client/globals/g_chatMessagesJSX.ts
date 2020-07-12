import SteamChatMessageModel from "../../models/models/chats/SteamChatMessageModel";
import { Subject } from "rxjs";
import UpdatingSubject from "../../classes/rxjs-extending/UpdatingSubject";

const g_chatMessagesJSX: g_chatMessagesJSXType = {};

type g_chatMessagesJSXType = Record<string, MessageOriginModelJSX>;

export interface MessageOriginModelJSX {
  previous: JSX.Element[];
  new: UpdatingSubject<JSX.Element[]>;
}

export default g_chatMessagesJSX;

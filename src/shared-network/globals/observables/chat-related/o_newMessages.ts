import { Subject } from "rxjs";
import SteamChatMessageModel from "../../../../models/models/chats/SteamChatMessageModel";

const o_newMessages = new Subject<SteamChatMessageModel>();

export default o_newMessages;

import ActiveChatModel from "../../../../models/ActiveChatModel";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";

const g_activeChats: g_activeChatsType = {};

export type g_activeChatsType = Record<string, ActiveChatModel>;

export default g_activeChats;

import ClientActiveChatModel from "../models/ClientActiveChat";
import UpdatingSubject from "../../classes/rxjs-extending/UpdatingSubject";

const g_clientActiveChats: g_clientActiveChatsType = {};

type g_clientActiveChatsType = Record<string, UpdatingSubject<ClientActiveChatModel>>;

export default g_clientActiveChats;

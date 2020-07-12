import { Subject } from "rxjs";
import ActiveChatModel from "../../../../models/ActiveChatModel";

const o_newChats = new Subject<ActiveChatModel>();

export default o_newChats;

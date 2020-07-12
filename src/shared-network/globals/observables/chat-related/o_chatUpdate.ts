import { BehaviorSubject, Subject } from "rxjs";
import ActiveChatModel from "../../../../models/ActiveChatModel";
import AtLeast from "../../../../models/types/AtLeast";

const o_chatUpdate = new Subject<AtLeast<ActiveChatModel, "clientId" | "partnerId">>();

export default o_chatUpdate;

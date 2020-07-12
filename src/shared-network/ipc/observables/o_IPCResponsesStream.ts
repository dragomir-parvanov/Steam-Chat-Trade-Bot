import { Subject } from "rxjs";
import IPCMessageResponseModel from "../models/IPCMessageResponseModel";
export const o_IPCResponsesStream = new Subject<IPCMessageResponseModel>();

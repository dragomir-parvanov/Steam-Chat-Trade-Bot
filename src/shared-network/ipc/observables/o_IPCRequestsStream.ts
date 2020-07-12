import { Subject } from "rxjs";
import IPCMessageRequestModel from "../models/IPCMessageRequestModel";
export const o_IPCRequestsStream = new Subject<IPCMessageRequestModel>();

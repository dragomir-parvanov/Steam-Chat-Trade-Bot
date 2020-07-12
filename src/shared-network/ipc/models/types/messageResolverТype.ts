import IPCIdentifiable from "../../interfaces/IPCIdentifiable";
import IPCMessageResponseModel from "../IPCMessageResponseModel";

export type messageResolverType = (messageId: IPCIdentifiable["id"]) => Promise<IPCMessageResponseModel>
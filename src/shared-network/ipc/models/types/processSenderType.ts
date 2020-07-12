import IPCMessageRequestModel from "../IPCMessageRequestModel";
import IPCMessageResponseModel from "../IPCMessageResponseModel";

/**
 * The type of the function that is going to send the message to the server.
 */
export type processSenderType = (message: IPCMessageRequestModel | IPCMessageResponseModel) => Promise<void>
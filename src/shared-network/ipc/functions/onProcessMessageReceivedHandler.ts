import IPCMessageRequestModel from "../models/IPCMessageRequestModel";
import { Subject } from "rxjs";
import IPCMessageResponseModel from "../models/IPCMessageResponseModel";
import LogError from "../../../classes/errors/base/LogError";

/**
 * Handles every message received to the process.
 * @export
 * @param {Subject<IPCMessageRequestModel>} requestStream
 * @param {Subject<IPCMessageResponseModel>} responseStream
 */
export default function onProcessMessageReceivedHandler(
  requestStream: Subject<IPCMessageRequestModel>,
  responseStream: Subject<IPCMessageResponseModel>,
  message: any
): void {
  if (!message) {
    throw new LogError("Received null message from the process");
  }

  if ("routerAddress" in message) {
    requestStream.next(message as IPCMessageRequestModel);
    return;
  }

  if ("body" in message || "error" in message) {
    responseStream.next(message as IPCMessageResponseModel);
    return;
  }

  //throw new LogError(`The message that we received is not of type IPCMessageModel`, ["The message that we received:", message], 3);
}

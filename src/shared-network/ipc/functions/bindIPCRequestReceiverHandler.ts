import { Subject } from "rxjs";
import IPCMessageRequestModel from "../models/IPCMessageRequestModel";
import IPCMessageResponseModel from "../models/IPCMessageResponseModel";
import { processSenderType } from "../models/types/processSenderType";

/**
 * Bind the IPC receiver which will handle every request coming from the IPCMessageRequestModel stream.
 * For every request message we receive, call the function with the parameters from the IPC message if any, then
 * send the function response to the thread that sent us the message in the first time.
 * @export
 * @template T
 * @param {T} router
 * @param {Subject<IPCMessageRequestModel>} requestStream
 * @param {processSenderType} processSender
 */
export default function bindIPCRequestReceiverHandler<T extends object>(
  router: T,
  requestStream: Subject<IPCMessageRequestModel>,
  processSender: processSenderType
): void {
  requestStream.subscribe({
    next: async (message) => {
      const { id, functionArguments, routerAddress } = message;
      const response: IPCMessageResponseModel = {
        id: id,
      };
      let functionResponse;
      try {
        if ("functionArguments" in message) {
          functionResponse = await router[routerAddress](...(functionArguments as any));
        } else {
          functionResponse = await router[routerAddress]();
        }
      } catch (error) {
        const stringifiedError = JSON.stringify(error);
        console.log(`Error in ipc:\n${error}`);
        response.error = stringifiedError;
        await processSender(response);
        return;
      }
      response.body = functionResponse;
      if (response.body === undefined) {
        response.body = 3;
      }
      await processSender(response);

      // 28.04.2020 IAM NOT SURE WHY I DID PUT THAT HERE
      // without complete doesnt work.
      //for (const key in message) {
      //delete response[key];
      //}
      return;
    },
  });
}

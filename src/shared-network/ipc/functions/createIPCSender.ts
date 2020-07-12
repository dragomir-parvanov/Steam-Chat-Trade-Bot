import IPCMessageRequestModel from "../models/IPCMessageRequestModel";
import generateIPCIdentifiable from "./generateIPCIdentifiable";
import { Subject } from "rxjs";
import { filter, first } from "rxjs/operators";
import IPCMessageResponseModel from "../models/IPCMessageResponseModel";
import { processSenderType } from "../models/types/processSenderType";
import { IPCRouter } from "../models/types/IPCRouter";
import { PromisifiedObjectFunctions } from "../../../models/types/PromisifiedObjectFunctions";
import { steamClientRouter } from "../ipc-routes/steam-client/steamClientIPCRouter";

/**
 * It creates an IPC sender which can connect with an IPC receicer on another thread,
 * so we can call and get response from a function in another thread in this thread.
 * @export
 * @template Router
 * @param {Router} router
 * @param {Observable<IPCMessageResponseModel>} responseStream
 * @param {processSenderType} processSender
 * @returns {Router}
 */
export default function createIPCSender<Router extends IPCRouter>(
  router: Router,
  responseStream: Subject<IPCMessageResponseModel>,
  processSender: processSenderType
): PromisifiedObjectFunctions<Router> {
  const implementedRouter = {};

  // each key is function name, then its also a router name.
  for (const key in router) {
    implementedRouter[key as string] = function (...args: never[]): Promise<unknown> {
      const id = generateIPCIdentifiable();
      const request: IPCMessageRequestModel = {
        id: id,
        routerAddress: key,
      };
      if (args.length > 0) {
        request.functionArguments = args;
      }

      // creating a promise, so we can await the response from the process.
      const promise = new Promise<unknown>(async (resolve, rejects) => {
        // piping through from the response message stream and looking for the one with the id we have created earlier.
        responseStream
          .pipe(
            filter((m) => m.id === id),
            first()
          )
          .subscribe({
            next: (m: IPCMessageResponseModel) => {
              const { body, error } = m;

              if ("body" in m) {
                resolve(body);
              } else {
                // child process returned an error
                rejects(error);
              }
            },
          });
        // do not await this for now
        processSender(request);
      });

      // sending the request to the process.
      return promise;
    };
  }
  return (implementedRouter as never) as PromisifiedObjectFunctions<Router>;
}

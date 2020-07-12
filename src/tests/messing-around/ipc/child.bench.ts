import wait from "../../../functions/wait";
import bindIPCRequestReceiverHandler from "../../../shared-network/ipc/functions/bindIPCRequestReceiverHandler";
import { Subject } from "rxjs";
import IPCMessageRequestModel from "../../../shared-network/ipc/models/IPCMessageRequestModel";
import IPCMessageResponseModel from "../../../shared-network/ipc/models/IPCMessageResponseModel";
import createIPCSender from "../../../shared-network/ipc/functions/createIPCSender";
import onProcessMessageReceivedHandler from "../../../shared-network/ipc/functions/onProcessMessageReceivedHandler";

const processPromise = (message: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    process.send &&
      process.send(message, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
  });
};
const requestStream = new Subject<IPCMessageRequestModel>();
const responseStream = new Subject<IPCMessageResponseModel>();

// async function asyncScope() {
//     while (true) {
//         await processPromise({ foo: 313414123424, bar: 234324234234, foobar: "asd" });
//     }
// }

bindIPCRequestReceiverHandler({ asd: () => 3 }, requestStream, processPromise);

// function processBinding() {
//     let i = 0;
//     process.on("message", message => {
//         console.log(i++)
//         processPromise(message)
//     })
// }
//processBinding()
//asyncScope()

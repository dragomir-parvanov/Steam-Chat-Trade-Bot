import wait from "../../../functions/wait";
import { Subject } from "rxjs";
import IPCMessageRequestModel from "../../../shared-network/ipc/models/IPCMessageRequestModel";
import IPCMessageResponseModel from "../../../shared-network/ipc/models/IPCMessageResponseModel";
import onProcessMessageReceivedHandler from "../../../shared-network/ipc/functions/onProcessMessageReceivedHandler";
import bindIPCRequestReceiverHandler from "../../../shared-network/ipc/functions/bindIPCRequestReceiverHandler";

import { processSenderType } from "../../../shared-network/ipc/models/types/processSenderType";
import { childRouter } from "./childRouter";
import Axios from "axios";
import { rejects } from "assert";

process
  .on("unhandledRejection", async (reason, p) => {
    console.log(reason, "Unhandled Rejection at Promise", p);
    await Axios.post("http://localhost:3000/", reason);
  })
  .on("uncaughtException", async err => {
    console.log(err, "Uncaught Exception thrown");
    await Axios.post("http://localhost:3000/", err);
  });

const requestStream = new Subject<IPCMessageRequestModel>();
const responseStream = new Subject<IPCMessageResponseModel>();
const processSenderCount = 0;
const processSender: processSenderType = message => {
  //console.log("process sender count", processSenderCount++);
  return new Promise((resolve, reject) => {
    //console.log("message will be sent");
    process.send &&
      process.send(message, error => {
        //console.log("message should be sent");
        if (error) {
          reject(error);
        } else {
          resolve();
        }
        //console.error(`Error sending a requst:\n${error}`);
      });
  });
};
process.on("message", message => {
  //console.log("received message");
  onProcessMessageReceivedHandler(requestStream, responseStream, message);
});
bindIPCRequestReceiverHandler(childRouter, requestStream, processSender);

setInterval(() => {
  //Axios.get("http://localhost:3000/");
}, 500);

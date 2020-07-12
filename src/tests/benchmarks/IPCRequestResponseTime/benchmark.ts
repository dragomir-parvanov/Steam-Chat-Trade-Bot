import { Subject } from "rxjs";
import IPCMessageRequestModel from "../../../shared-network/ipc/models/IPCMessageRequestModel";
import IPCMessageResponseModel from "../../../shared-network/ipc/models/IPCMessageResponseModel";
import { fork } from "child_process";
import { forkOptions } from "../../../shared-network/ipc/config/IPCForkSettings";
import onProcessMessageReceivedHandler from "../../../shared-network/ipc/functions/onProcessMessageReceivedHandler";
import createIPCSender from "../../../shared-network/ipc/functions/createIPCSender";
import { childRouter } from "./childRouter";
import { processSenderType } from "../../../shared-network/ipc/models/types/processSenderType";
import bindIPCRequestReceiverHandler from "../../../shared-network/ipc/functions/bindIPCRequestReceiverHandler";
import wait from "../../../functions/wait";

const requestStream = new Subject<IPCMessageRequestModel>();
const responseStream = new Subject<IPCMessageResponseModel>();

const child = fork("child.ts");

child.on("exit", code => {
  console.log("Exited with a code", code);
});

//setInterval(() => { console.log("child listener count", child.listeners.length) },50)
//let processSenderCount = 0;
const processSender: processSenderType = message => {
  return new Promise((resolve, reject) => {
    child.send &&
      child.send(message, error => {
        //console.log("sent message count:", processSenderCount++);
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve();
        }
      });
  });
};
// let processMessageCount = 0;
// process.on("message", () => {
//   console.log("process message count", ++processMessageCount)

// })
//initializeMessageDistributor.call(child,child,requestStream,responseStream)

const ipcSender = createIPCSender(childRouter, responseStream, processSender);
child.on("message", message => {
  onProcessMessageReceivedHandler(requestStream, responseStream, message);
});
async function asyncScope() {
  for (let i = 1; i < 1000; i++) {
    const start = process.hrtime();
    const result = await ipcSender.multiplyByTwo(i);
    const result2 = await ipcSender.someAsyncFunction(i).catch(console.log);
    const end = process.hrtime(start);
    console.log(`Seconds: ${end[0]}, Nanoseconds: ${end[1]}, iteration: ${i}, result: ${result} result2: ${result2}`);
    //console.log(i)
    //await wait(1)
  }
  console.log("end");
}

const sentNumberObject = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15:0
}

const numberObject = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
  10: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15:0
  
}
function loop2(number: number) {
  return setInterval(async () => {
    console.log("called from number", number)
    sentNumberObject[number]++
    const start = process.hrtime();
    const result = await ipcSender.multiplyByTwo(2);
    const end = process.hrtime(start);
    numberObject[number]++
    console.log(`Seconds: ${end[0]}, Nanoseconds: ${end[1]} number: ${number}`);
  }, 0);
}

wait(5000).then(async () => {
  const intervals = []
  for (let i = 1; i <= 15; i++){
    intervals.push(loop2(i) as never)
  }
  await wait(60000)
  intervals.forEach(i => clearInterval(i))
  await wait(100)
  console.log(Object.values(numberObject).reduce<number>((acc,number)=>acc+number,0))
  console.log("Received", JSON.stringify(numberObject))
  console.log("Sent    ", JSON.stringify(sentNumberObject))
  process.exit(0)
});

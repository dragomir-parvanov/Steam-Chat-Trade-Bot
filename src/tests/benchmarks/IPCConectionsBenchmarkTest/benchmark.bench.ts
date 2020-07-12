import { fork, ForkOptions, ChildProcess } from "child_process";
import wait from "../../../functions/wait";
import { EventEmitter } from "events";

const childsCount = 1;
interface TestChild {
  process: ChildProcess;
  eventEmmitter: EventEmitter;
}
const childs: TestChild[] = [];

import { forkOptions } from "../../../shared-network/ipc/config/IPCForkSettings";
import generateGUID from "../../../functions/generateGUID";

export interface Transaction {
  transactionId: number;
  message: string;
}

async function waitForTransaction(transactionId: string, eventEmmitter: EventEmitter): Promise<string> {
  return new Promise(resolve => {
    eventEmmitter.prependOnceListener(transactionId, (transaction: Transaction) => {
      resolve(transaction.message);
    });
  });
}
let violationCount = 0;
async function asyncScope() {
  for (let i = 1; i < childsCount; i++) {
    const child = fork("childProccess.ts", [], forkOptions);

    const childEvent = new EventEmitter();

    child.on("message", (transaction: Transaction) => {
      console.log(transaction.message);
      childEvent.emit(transaction.transactionId.toString(), transaction);
    });

    childs.push({ process: child, eventEmmitter: childEvent });
  }
  let count = 0;
  childs.forEach(async c => {
    async function loop(child: TestChild) {
      const start = process.hrtime();
      const operationId = generateGUID();
      child.process.send({ transactionId: operationId, message: "testMessage" });
      const message = await waitForTransaction(operationId, child.eventEmmitter);
      console.log("message from child", message);
      const [seconds] = process.hrtime(start);
      console.log(++count);
      if (seconds > 1) {
        console.error(`Execution took more than one second\n violation count: ${++violationCount}`);
      }
      await loop(child);
    }
    await loop(c);
  });
}
wait(10).then(()=>console.log("her"))
asyncScope();

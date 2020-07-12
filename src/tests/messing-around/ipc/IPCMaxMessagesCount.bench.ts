import { fork } from "child_process";
import { forkOptions } from "../../../shared-network/ipc/config/IPCForkSettings";
import wait from "../../../functions/wait";
import e from "express";
import createIPCSender from "../../../shared-network/ipc/functions/createIPCSender";

const child = fork("child.ts", [], forkOptions);
child.on("exit", code => {
  console.log("Exited with a code", code);
});
child.stdout?.on("data", data => {
  console.log(`stdout: ${data}`);
});
child.stdout?.on("error", error => {
  console.log(error);
});


const processPromise = message => {
  return new Promise((resolve, reject) => {
    child.send &&
      child.send(message, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
  });
};
async function asyncScope() {
  for (let i = 0; i < 99999999; i++) {
      processPromise({ id: 313414123424, body: 234324234234, routerAddress: "asd" });
      await wait(50)
  }
}


let incomingMessages = 0;
wait(1000).then(asyncScope)
function childBind() {
    child.on("message", (message) => {

        console.log("Incoming messages", ++incomingMessages, "message is and should be:", message);
        processPromise({ id: 313414123424, body: 234324234234, routerAddress: "asd" });
    });
}
childBind()


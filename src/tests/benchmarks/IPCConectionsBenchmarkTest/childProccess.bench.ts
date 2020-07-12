import wait from "../../../functions/wait";
import { Transaction } from "./benchmark.bench";
import Axios from "axios";

process.on("message", (message: Transaction) => {
  if (process.send) {
    const transaction: Transaction = {
      transactionId: message.transactionId,
      message: "message from child proccess",
    };
    //console.log("child process");
    process.send(transaction);
  } else {
    throw new Error();
  }
});
setInterval(() => {
  Axios.get("http://localhost:3000/");
}, 500);

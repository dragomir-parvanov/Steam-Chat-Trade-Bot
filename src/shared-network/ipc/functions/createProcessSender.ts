import { processSenderType } from "../models/types/processSenderType";
import { ChildProcess } from "child_process";
import LogError from "../../../classes/errors/base/LogError";
import CriticalLogError from "../../../classes/errors/base/CriticalLogError";

export default function createProcessSender(processTarget: NodeJS.Process | ChildProcess): processSenderType {
  const processSender: processSenderType = (message) => {
    return new Promise((resolve, reject) => {
      if (!processTarget.send) {
        throw new CriticalLogError("process.send is null or undefied");
      }

      processTarget.send(message, (error) => {
        if (error) {
          reject(new LogError("We couldn't send message to the process target", ["Error message", error], 10));
        } else {
          resolve();
        }
      });
    });
  };
  return processSender;
}

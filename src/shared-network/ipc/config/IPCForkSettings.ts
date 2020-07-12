import { ForkOptions } from "child_process";

export const forkOptions: ForkOptions = {
  stdio: ["pipe", "pipe", "pipe", "ipc"],
  silent: true
  // see https://stackoverflow.com/questions/50885128/how-can-i-debug-a-child-process-fork-process-from-visual-studio-code/50885129#50885129
  //execArgv: [],
};

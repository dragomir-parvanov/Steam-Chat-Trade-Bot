import WorkerClientModel from "../../../models/WorkerClientModel";
import { PromisifiedObjectFunctions } from "../../../models/types/PromisifiedObjectFunctions";
import { steamClientRouter } from "../../../shared-network/ipc/ipc-routes/steam-client/steamClientIPCRouter";
import { ChildProcess } from "child_process";
import { SteamId64 } from "../../../models/types/SteamId64";
import ImplementedBindRouterType from "../../../shared-network/client-bind/models/ImplementedBindRouterType";

export default interface ImplementedWorkerClientModel {
  clientId: SteamId64;
  functions: ImplementedBindRouterType;
}

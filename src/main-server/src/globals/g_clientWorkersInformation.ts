import { SteamId64 } from "../../../models/types/SteamId64";
import WorkerClientModel from "../../../models/WorkerClientModel";
import ImplementedWorkerClientModel from "../models/ImplementedWorkerClientModel";

const g_clientWorkersInformation: Record<SteamId64, WorkerClientModel> = {};

export default g_clientWorkersInformation;

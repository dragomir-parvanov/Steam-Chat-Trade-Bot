import { SteamId64 } from "../../../models/types/SteamId64";
import ImplementedWorkerClientModel from "../models/ImplementedWorkerClientModel";

const g_clientWorkersImplementation: Record<SteamId64, ImplementedWorkerClientModel> = {};

export default g_clientWorkersImplementation;

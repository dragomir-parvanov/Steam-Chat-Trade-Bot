import log from "../../../classes/logger/Log";
import { ELoggerEnviroment } from "../../../classes/logger/ELoggerEnviroment";
import { hostConfig } from "./hostConfig";

/**
 *Configuring the logger for the minner.
 *
 * @export
 */
export default function configureMinerLogger(): void {
  log.enviroment = ELoggerEnviroment.Miner;
  log.mainServerUrl = hostConfig.baseUrl + "/log/";
  log.init();
}

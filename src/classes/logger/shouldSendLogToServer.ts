import { ELoggerEnviroment } from "./ELoggerEnviroment";

/**
 * If we should send the log to the main server.
 * @export
 * @param {ELoggerEnviroment} enviroment
 */
export default function shouldSendLogToServer(enviroment: ELoggerEnviroment): boolean {
    if (enviroment === ELoggerEnviroment.SteamClient) {
        return true;
    }

    if (enviroment === ELoggerEnviroment.SteamClientCluster) {
        return true;
    }

    if (enviroment === ELoggerEnviroment.Miner) {
        return true;
    }

    if (enviroment === ELoggerEnviroment.Web) {
        return true;
    }

    return false;
}
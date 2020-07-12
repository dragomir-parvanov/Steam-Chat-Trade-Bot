import { LogMessage } from "./LogMessage";
import LogErrorModel from "./LogErrorModel";


/**
 * Creates LogModel.
 * @export
 * @param {LogMessage} additionalMessage
 * @param {number} level
 * @param {Date} date
 * @param {Error} [error]
 * @returns {LogErrorModel}
 */
export default function createLogErrorForSending(additionalMessage: LogMessage, level: number,date: Date, error?: Error): LogErrorModel {
    const log: LogErrorModel = {} as LogErrorModel
    if (additionalMessage) {
        log.additionalMessage = additionalMessage
    }
    log.level = level;
    log.date = date;
    if (error) {
        log.error = {
            stack :error.stack,
            message : error.message,
            name : error.name
        }
    }

    return log;
}
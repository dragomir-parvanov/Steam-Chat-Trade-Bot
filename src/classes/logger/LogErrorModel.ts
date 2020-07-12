import { LogMessage } from "./LogMessage";
import LogNormalModel from "./LogNormalModel";
import LogLevelModel from "./LogLevelModel";


/**
 * In which way the log will be preserved in the database and served trough the network
 * @export
 * @interface LogMLogErrorModelodel
 */
export default interface LogErrorModel extends Partial<LogNormalModel>,LogLevelModel{
    
    /**
     * The error object.
     * @type {Error}
     * @memberof LogModel
     */
    error: Error;


    /**
     * Additional message to the log.
     * @type {LogMessage}
     * @memberof LogModel
     */
    additionalMessage?: LogMessage;
}
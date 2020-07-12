import log from "../../logger//Log";
import { LogMessage } from "../../logger/LogMessage";

/**
 * Throwing and loggin an error.
 * Every error on this app should be generated trough this class
 * @export
 * @class PError
 * @extends {Error}
 */
export default class LogError extends Error {
  /**
   * Loggin a level 0 error.
   * @static
   * @param {LogMessage} message Additional message
   * @memberof Log
   */
  constructor(message: string);

  /**
   * Loggin an error with specific error level.
   * @static
   * @param {number} level On which level we classify the error. The higher the level is, the more critical the erros is.
   * @memberof Log
   */
  constructor(message: string, level: number);

  constructor(message: string, additionalMessage: LogMessage);
  constructor(message: string, additionalMessage: LogMessage, level: number);
  constructor(message: string, secondArg?: number | LogMessage, level?: number) {
    super(message);

    if (secondArg) {
      if (typeof secondArg === "string" || "object") {
        // second argument as an additional message
        secondArg = secondArg as string;
        if (level) {
          //level is present
          log.error(this, level, secondArg);
        } else {
          //level is not present
          log.error(this, secondArg);
        }
      } else {
        // second argument as a level priority
        secondArg = secondArg as number;
        log.error(this, secondArg);
      }
    }
  }
}

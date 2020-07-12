import { ELoggerEnviroment } from "./ELoggerEnviroment";
import { LogMessage } from "./LogMessage";
import isErrorLogged from "./isErrorLogged";
import shouldSendLogToServer from "./shouldSendLogToServer";
import tryy from "../../functions/tryy/tryy";
import { MAIN_SERVER_MAX_RETRIES } from "../../shared-network/constants/to-main/max-retries/MAIN_SERVER_MAX_RETRIES";
import { MAIN_SERVER_WAIT_ON_FAIL } from "../../shared-network/constants/to-main/wait-before-retry/MAIN_SERVER_WAIT_ON_FAIL";
import Axios from "axios";
import { ELogType } from "./ELogType";
import createLogErrorForSending from "./createLogErrorForSending";
import LogErrorModel from "./LogErrorModel";
import LogNormalModel from "./LogNormalModel";
import LogWarningModel from "./LogWarningModel";
import { SteamId64 } from "../../models/types/SteamId64";

/**
 * Logging functions.
 * @export
 * @class Log
 */
// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class log {
  /**
   * In which enviroment the logger works.
   * @static
   * @type {ELoggerEnviroment}
   * @memberof Log
   */
  static enviroment: ELoggerEnviroment;

  /**
   * This is only required when the enviroment is set to SteamClient.
   * @static
   * @type {SteamId64}
   * @memberof Log
   */
  static clientId: SteamId64;

  /**
   * The ip of the main server that the logs will be sent.
   * @static
   * @type {string}
   * @memberof Log
   */
  static mainServerUrl: string;

  /**
   * Loggin a level 0 error.
   * @static
   * @param {Error} error
   * @param {LogMessage} [additionalMessage] Additional message
   * @memberof Log
   */
  static error(error: Error, additionalMessage?: LogMessage): Promise<void>;

  /**
   * Loggin an error with specific error level.
   * @static
   * @param {Error} error
   * @param {number} level On which level we classify the error. The higher the level is, the
   * @param {LogMessage} [additionalMessage] Additional message to the error
   * @memberof Log
   */
  static error(error: Error, level: number, additionalMessage?: LogMessage): Promise<void>;
  static async error(error: Error, secondArg?: LogMessage | number, additionalMessage?: LogMessage): Promise<void> {
    const date = new Date();
    if (!this.initialized) {
      throw new Error("Logger is not initialized");
    }

    if (isErrorLogged(error, secondArg)) {
      console.log("skipping because error is logged");
      return;
    }

    if (secondArg) {
      if (typeof secondArg === "string" || "object") {
        // additional message as second argument
        secondArg = secondArg as string;
        console.error(`Error occured with additional message:${secondArg}\n
                message:\n${error.message}`);

        const log = createLogErrorForSending(secondArg, 0, date, error);
        this.handleLog(log, ELogType.Error);
      } else {
        // level as second argument
        secondArg = secondArg as number;
        if (additionalMessage) {
          // additional message is present
          console.error(`Error occured with additional message:${additionalMessage}\n
                Error level:${secondArg}\n`);

          const log = createLogErrorForSending(additionalMessage, secondArg, date, error);
          this.handleLog(log, ELogType.Error);
        } else {
          console.error(`Error occured with level:${secondArg}`);
          const log = createLogErrorForSending("", secondArg, date, error);
          this.handleLog(log, ELogType.Error);
        }
      }
    } else {
      console.error(`Error with message ${error.message} occured`);

      const log = createLogErrorForSending("", 0, date, error);

      this.handleLog(log, ELogType.Error);
    }
  }

  /**
   * When a critical error occurs that stops the program from executing.
   * @example When a steam client emits that the config ip differs from the one that steam reports.
   * @static
   * @param {LogMessage} errorMessage
   * @param {unknown} [error] the error
   * @memberof Log
   */
  static async critical(errorMessage: LogMessage, error?: Error): Promise<void> {
    const date = new Date();

    if (!this.initialized) {
      throw new Error("Logger is not initialized");
    }

    console.error(`Critical error:${errorMessage}\n
        error object:${error}`);

    const log = createLogErrorForSending(errorMessage, 0, date, error);

    this.handleLog(log, ELogType.Critical);
  }

  /**
   * Warn logging
   * When the enviroment is set to SteamClient, this will send to the main server also.
   * @example When an operation takes more time than expected.
   * @static
   * @param {LogMessage} message
   * @param {number} [level]
   * @memberof Log
   */
  static async warn(message: LogMessage, level?: number): Promise<void> {
    const date = new Date();

    if (!this.initialized) {
      throw new Error("Logger is not initialized");
    }

    console.warn(`Warning:\n
                   level:${level || 0}\n
                   message:${message}`);

    const log = createLogErrorForSending(message, level || 0, date);

    await this.handleLog(log, ELogType.Warning);
  }

  /**
   * Normal logging
   * When the enviroment is set to SteamClient, this will send to the main server also.
   * @static
   * @memberof Log
   */
  static async do(message: LogMessage): Promise<void> {
    const date = new Date();
    if (!this.initialized) {
      throw new Error("Logger is not initialized");
    }

    console.log(message);

    const log: LogNormalModel = {
      additionalMessage: message,
      date: date,
    };

    await this.handleLog(log, ELogType.Normal);
  }

  /**
   * Initializing the logger.
   * The logger cannot be used before initializing
   * @static
   * @memberof Log
   */
  static init(): void {
    if (!this.enviroment && this.enviroment !== 0) {
      throw new Error("Enviroment is not set.");
    }

    this.shouldSendToMainServer = shouldSendLogToServer(this.enviroment);
    console.log(this.enviroment);
    if (this.shouldSendToMainServer && !this.mainServerUrl) {
      throw new Error("Main server url is not set.");
    }

    if (this.enviroment === ELoggerEnviroment.SteamClient && !this.clientId) {
      throw new Error("clientId is not initialized");
    }

    this.initialized = true;
  }

  /**
   ** If we should send the the log to the main server.
   * @private
   * @static
   * @memberof Log
   */
  private static shouldSendToMainServer = false;

  /**
   * If the logger is initialized and ready to go.
   * @static
   * @type {boolean}
   * @memberof Log
   */
  private static initialized: boolean;

  static async handleLog(log: LogErrorModel | LogNormalModel | LogWarningModel, logType: ELogType): Promise<void> {
    if (this.enviroment !== ELoggerEnviroment.None || ELoggerEnviroment.Main) {
      await tryy(
        {
          maxRetries: MAIN_SERVER_MAX_RETRIES,
          waitOnFail: MAIN_SERVER_WAIT_ON_FAIL,
        },
        async () => {
          // Main server url + enviroment + log type
          // example: localhost:3000/api/log/miner/error
          // if the enviroment is set to steam client the url will look like this:
          // example - localhost:3000/api/log/{ourClientId}/error
          const url =
            this.mainServerUrl +
            (this.enviroment === ELoggerEnviroment.SteamClient ? this.clientId : ELoggerEnviroment[this.enviroment]) +
            "/" +
            ELogType[logType];
          await Axios.post(url, log);
        }
      );
    }
  }
}

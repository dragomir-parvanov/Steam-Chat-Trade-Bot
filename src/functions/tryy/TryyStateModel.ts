import { LogMessage } from "../../classes/logger/LogMessage";

export default interface TryyStateModel {
  /**
   * If this is not undefined or null, that means the function is cancelled with a message.
   * @type {LogMessage}
   * @memberof TryyStateModel
   */
  isCancelledWithMessage?: string;
}

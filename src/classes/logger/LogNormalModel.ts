import { LogMessage } from "./LogMessage";
import Identifiable from "../../data/identifiables/Identifiable";

export default interface LogNormalModel extends Identifiable {
  /**
   * Additional message to the log.
   * @type {LogMessage}
   * @memberof LogModel
   */
  additionalMessage: LogMessage;

  /**
   * When this was logged
   * @type {Date}
   * @memberof LogModel
   */
  date: Date;
}

import log from "../../logger/Log";

export default class CriticalLogError extends Error {
  constructor(message: string) {
    super();
    log.critical(message);
  }
}

import { LogMessage } from "./LogMessage";

const sentErrors: Set<Error> = new Set();

/**
 * Checks if the error is already logged.
 * If an error have additional message, we dont check if its logged.
 * @export
 * @param {Error} error
 */
export default function isErrorLogged(error: Error, secondArg?: number | LogMessage): boolean {
  if (secondArg) {
    sentErrors.add(error);
    return false;
  }

  const exist = sentErrors.has(error);

  if (!exist) {
    sentErrors.add(error);
  }

  return exist;
}

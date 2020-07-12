/**
 * Chechking if an object is actually a promise
 * @export
 * @param {never} functionToCheck
 * @returns {boolean}
 */
export default function isAPromise(functionToCheck: object): boolean {
  if (functionToCheck == null) {
    throw new Error("The function to check is null");
  }

  if (functionToCheck["then"]) {
    return true;
  }

  return false;
}

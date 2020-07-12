/**
 * Checking if something is null or undefined.
 * @export
 * @param {unknown} something
 * @returns {boolean}
 */
export default function isNullOrUndefined(something: unknown): boolean {
  if (something === null) {
    return true;
  }

  if (typeof something === "undefined") {
    return true;
  }

  return false;
}

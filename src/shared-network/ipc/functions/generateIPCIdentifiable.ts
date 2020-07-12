import IPCIdentifiable from "../interfaces/IPCIdentifiable";
import generateGUID from "../../../functions/generateGUID";

/**
 * Generates an unique IPC Identifiable.
 * @export
 * @returns {string}
 */
export default function generateIPCIdentifiable(): IPCIdentifiable["id"] {
  return generateGUID();
}

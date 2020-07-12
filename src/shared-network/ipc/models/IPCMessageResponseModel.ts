import IPCIdentifiable from "../interfaces/IPCIdentifiable";

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IPCMessageResponseModel extends IPCIdentifiable {
  /**
   * If an error occured.
   * @type {Error}
   * @memberof IPCMessageResponseModel
   */
  error?: Error | string;

  /**
   * If the operation was successful, this is the response.
   * @type {never}
   * @memberof IPCMessageResponseModel
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

import IPCIdentifiable from "../interfaces/IPCIdentifiable";



/**
 * Inter-process communication model.
 * This model represents how a request is being sent from thread 1, asking for a response from thread2
 * @export
 * @interface IPCMessageModel
 * @template T
 */
// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IPCMessageRequestModel extends IPCIdentifiable{



    /**
     * The router address where the message should be processed in thread 2
     * @type {string}
     * @memberof IPCMessageRequestModel
     */
    routerAddress: string;

    /**
     * The arguments that we want to call the function with.
     * @type {T}
     * @memberof IPCMessageModel
     */
    functionArguments?: never[];

}

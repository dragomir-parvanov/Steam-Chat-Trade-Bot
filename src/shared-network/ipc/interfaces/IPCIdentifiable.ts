// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export default interface IPCIdentifiable{
    /**
     * Unique identificator for each IPC message.
     * We use this identify which message belongs to a particular caller.
     * @type {string}
     * @memberof IPCIdentifiable
     */
    id: string;
}
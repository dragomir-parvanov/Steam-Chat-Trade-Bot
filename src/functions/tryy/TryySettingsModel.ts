
/**
 * Used for specifying settings for "tryy" function
 * @export
 * @interface TryySettings
 */
export default interface TryySettingsModel {
    
    /**
     * How many tries before giving up.
     * @type {number}
     * @memberof TryySettings
     */
    maxRetries?: number;


    /**
     * Waiting milliseconds before giving another try on the operation.
     * @type {number}
     * @memberof TryySettings
     */
    waitOnFail?: number;

    /**
     * The maximum time of an operat
     *
     * @type {number}
     * @memberof TryySettings
     */
    timeout?: number;
}
import LogError from "./base/LogError"
import { LogMessage } from "../logger/LogMessage"

/**
 * An error which is threw by the "tryy" module.
 * @export
 * @class TryyError
 * @extends {Error}
 */
export default class TryyError extends Error{
    constructor(errors: Error[], message: string) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        super(message)
        this.errors = errors
    }


    /**
     * All errors that occured while trying  to perform the function.
     * @type {Error[]}
     * @memberof TryyError
     */
    errors: Error[]

    name = "tryy"
}

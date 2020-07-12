/**
 * Preventing the code from executing for n amount of milliseconds.
 * @export
 * @param {number} milliseconds
 * @returns {Promise<void>}
 */
export default function wait(milliseconds: number): Promise<void>{
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },milliseconds)
    })
}
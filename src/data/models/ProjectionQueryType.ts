/**
 *  The acccepted projection type in mongo db driver.
 */
export type ProjectionType<T> = {
    [i in keyof T]?: 0|1
}

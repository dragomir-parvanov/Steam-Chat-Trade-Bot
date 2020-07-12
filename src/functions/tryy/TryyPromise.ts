export type TryyPromise<T> = Promise<T> & {
    timeout: (callback: Function) => void;
    then: TryyPromise<T>;
}
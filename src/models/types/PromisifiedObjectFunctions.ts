export interface FunctionWithTypedReturn extends Function {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: any[]): any;
}
/**
 * All functions in the object are promisified
 */
export type PromisifiedObjectFunctions<T> = {
  [i in keyof T]: T[i] extends FunctionWithTypedReturn
    ? ReturnType<T[i]> extends Promise<any>
      ? (...args: Parameters<T[i]>) => ReturnType<T[i]>
      : (...args: Parameters<T[i]>) => Promise<ReturnType<T[i]>>
    : T[i];
};

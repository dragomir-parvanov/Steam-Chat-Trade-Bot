import { AsUniqueArray } from "../models/types/UniqueArray";
import { ETradeOfferState } from "steam-tradeoffer-manager";

const RecordFunctions = {
  /**
   * Identical to Array.map but for Records
   * Creates new shallow object.
   * @static
   * @template T Record
   * @template R New result
   * @template K Key of the record
   * @template V Value of the record
   * @param {(value: V) => R} lambda
   * @param {T} record
   * @returns {Record<K, R>}
   * @memberof RecordFunctions
   */
  map<V, R, K extends RecordKeyType>(record: Record<K, V>, lambda: (value: V, key: string) => R): Record<string, R> {
    const newRecord: Record<K, R> = {} as never;
    for (const key in record) {
      newRecord[key as string] = lambda(record[key], key);
    }
    return newRecord;
  },
  filter<K extends RecordKeyType, V>(record: Record<K, V>, lambda: (value: V, key: string) => boolean) {
    const newRecord: Record<K, V> = {} as never;
    for (const key in record) {
      if (lambda(record[key], key)) {
        newRecord[key as string] = record[key];
      }
    }
    return newRecord;
  },
  forEach<V, R, K extends RecordKeyType>(record: Record<K, V>, lambda: (value: V, key: string) => void): void {
    for (const key in record) {
      lambda(record[key], key);
    }
  },
  convertToRecord<T>(array: T[], key: keyof T): Record<string, T> {
    const newRecord: Record<string, T> = {};
    array.forEach((i) => (newRecord[i[key as string]] = i));
    return newRecord;
  },
  /**
   * Caution: Cannot sort Records where keys are numbers, because strings that parses to int are always sorted by ascending order, no matter what we do.
   * Sort record with specific order, the first element in the array are the first object keys
   * All unspecified fields are append at the end of the record
   * @param record
   * @param order
   */
  orderByOrder<V, K extends RecordKeyType>(record: Record<string, V>, order: AsUniqueArray<Array<keyof Record<string, V>>, V[]>) {
    const newRecord: Record<string, V> = {} as any;
    for (const key of order) {
      if (key in record) {
        newRecord[key] = record[key];
      }
    }
    console.log("new Record", newRecord);
    for (const key in record) {
      if (!order.some((o) => key === o.toString())) {
        newRecord[key] = record[key];
      }
    }
    console.log("start record", newRecord);
    return newRecord;
  },
};

export type RecordKeyType = string | symbol | number;

export default RecordFunctions;

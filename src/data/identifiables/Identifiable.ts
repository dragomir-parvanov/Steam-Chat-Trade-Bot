import { SteamId64 } from "../../models/types/SteamId64";

/**
 * The default identifiable
 * If this is not provided, mongo db will generate one.
 * If this is set, it must be unique in the mongo db collection.
 * @export
 * @interface Identifiable
 * @template T
 */
export default interface Identifiable<T = string | SteamId64> {
  _id?: T;
}

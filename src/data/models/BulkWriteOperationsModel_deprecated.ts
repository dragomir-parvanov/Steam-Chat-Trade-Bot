import Identifiable from "../identifiables/Identifiable";
import { FilterQuery, UpdateOneOptions, UpdateQuery } from "mongodb";
import { QueryUpdateOptions } from "mongoose";

/**
 * @deprecated use mongo native model
 */
export default interface BulkWriteOperationsModel_deprecated<T extends Identifiable> {
  insertOne?: { document: T };
  updateOne?: { filter: FilterQuery<T>; update: UpdateQuery<T>; upsert?: boolean };
}

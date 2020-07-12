/* eslint-disable @typescript-eslint/no-explicit-any */
import * as mongodb from "mongodb";
import { ProjectionType } from "../../models/ProjectionQueryType";
import { EMongoDbCollectionNames } from "../../EMongoDbCollectionNames";
import { FilterQuery, Cursor, CollectionInsertOneOptions, UpdateOneOptions, CollectionInsertManyOptions, BulkWriteOperation } from "mongodb";
import DbServiceInterface from "./DbServiceInterface";
import getMongoDb from "../../functions/getMongoDb";
import BulkWriteOperationsModel_deprecated from "../../models/BulkWriteOperationsModel_deprecated";
import Identifiable from "../../identifiables/Identifiable";

export default class DbServiceBase<Entity extends NonNullable<Identifiable<number | string>>, Identification = NonNullable<Entity["_id"]>>
  implements DbServiceInterface<Entity, Identification> {
  collection: string;
  constructor(collection: EMongoDbCollectionNames) {
    this.collection = EMongoDbCollectionNames[collection];
  }

  /**
   * Used to get the type of the query
   *
   * @type {FilterQuery<Entity>}
   * @memberof DbServiceBase
   */
  query: FilterQuery<Entity> = {};

  /**
   * Used to get the type of the projection
   * @type {ProjectionType<Entity>}
   * @memberof DbServiceBase
   */
  projection: ProjectionType<Entity> = {};

  static db: mongodb.Db;
  async findOne(id: Identification, projection?: ProjectionType<Entity>): Promise<Entity | null>;
  async findOne(query: mongodb.FilterQuery<Entity>, projection?: ProjectionType<Entity>): Promise<Entity | null>;
  async findOne(firstArg: Identification | FilterQuery<Entity>, projection?: ProjectionType<Entity>): Promise<Entity | null> {
    const options: mongodb.FindOneOptions = projection ? { projection: projection } : {};

    let doc: Entity | null;

    if (typeof firstArg === "object") {
      // Query
      doc = await DbServiceBase.db.collection(this.collection).findOne<Entity>(firstArg, options);
    } else {
      // Identficiation
      doc = await DbServiceBase.db.collection(this.collection).findOne<Entity>({ _id: firstArg }, options);
    }

    return doc;
  }

  findMany(ids: Identification[], projection?: ProjectionType<Entity> | undefined): Cursor<Entity>;
  findMany(query: FilterQuery<Entity>, projection?: ProjectionType<Entity> | undefined): Cursor<Entity>;
  findMany(firstArg: Identification[] | FilterQuery<Entity>, projection?: ProjectionType<Entity> | undefined): Cursor<Entity> {
    const options: mongodb.FindOneOptions = projection ? { projection: projection } : {};

    let docs: Cursor<Entity>;

    if (typeof firstArg === "object" && !firstArg.length) {
      // Query
      docs = DbServiceBase.db.collection(this.collection).find(firstArg, options);
    } else {
      // Identficiation
      docs = DbServiceBase.db.collection(this.collection).find<Entity>({ _id: { $in: firstArg } }, options);
    }
    return docs;
  }

  async insertOne(entity: Entity, options?: CollectionInsertOneOptions): Promise<mongodb.InsertOneWriteOpResult<any>> {
    const result = await DbServiceBase.db.collection(this.collection).insertOne(entity, options);
    entity._id = result.insertedId;
    return result;
  }

  async insertMany(entities: Entity[], options?: CollectionInsertManyOptions): Promise<mongodb.InsertWriteOpResult<any>> {
    return await DbServiceBase.db.collection(this.collection).insertMany(entities, options);
  }

  updateOne(id: Identification, updateQuery: mongodb.UpdateQuery<Entity>, options?: UpdateOneOptions): Promise<mongodb.UpdateWriteOpResult>;
  updateOne(query: mongodb.FilterQuery<Entity>, updateQuery: mongodb.UpdateQuery<Entity>, options?: UpdateOneOptions): Promise<mongodb.UpdateWriteOpResult>;
  async updateOne(
    firstArg: mongodb.FilterQuery<Entity> | Identification,
    updateQuery: mongodb.UpdateQuery<Entity>,
    options?: UpdateOneOptions
  ): Promise<mongodb.UpdateWriteOpResult> {
    if (!firstArg) {
      throw new Error("Firt argument cannot be null");
    }
    if (typeof firstArg === "object") {
      return await DbServiceBase.db.collection(this.collection).updateOne(firstArg, updateQuery, options);
    } else {
      const query: FilterQuery<Entity> = { _id: firstArg };
      return await DbServiceBase.db.collection(this.collection).updateOne(query, updateQuery, options);
    }
  }

  updateMany(id: Identification[], updateQuery: mongodb.UpdateQuery<Entity>): Promise<mongodb.UpdateWriteOpResult>;
  updateMany(query: mongodb.FilterQuery<Entity>, updateQuery: mongodb.UpdateQuery<Entity>): Promise<mongodb.UpdateWriteOpResult>;
  async updateMany(firstArg: mongodb.FilterQuery<Entity> | Identification[], updateQuery: mongodb.UpdateQuery<Entity>): Promise<mongodb.UpdateWriteOpResult> {
    if (!firstArg) {
      throw new Error("Firt argument cannot be null");
    }
    if (typeof firstArg === "object" && firstArg.length) {
      // identification
      firstArg = firstArg as Identification[];
      return await DbServiceBase.db.collection<Entity>(this.collection).updateMany({ _id: { $in: firstArg as never } }, updateQuery);
    } else {
      // query
      return await DbServiceBase.db.collection(this.collection).updateMany(firstArg, updateQuery);
    }
  }

  async bulkWrite(params: BulkWriteOperation<Entity>[]) {
    return await DbServiceBase.db.collection<Entity>(this.collection).bulkWrite(params);
  }
  aggregate(pipeline: object[]) {
    return DbServiceBase.db.collection(this.collection).aggregate(pipeline);
  }
}

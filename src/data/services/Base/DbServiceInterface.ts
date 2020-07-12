/* eslint-disable @typescript-eslint/no-explicit-any */
import Identifiable from "../../identifiables/Identifiable";

import { ProjectionType } from "../../models/ProjectionQueryType";
import { FilterQuery, UpdateQuery, InsertOneWriteOpResult, InsertWriteOpResult, UpdateWriteOpResult } from "mongodb";

export default interface DbServiceInterface<Entity extends NonNullable<Identifiable<string | number>>, Identification = Entity["_id"]> {
  findOne(firstArg: Identification, projection?: ProjectionType<Entity>): Promise<Entity | null>;
  findOne(query: FilterQuery<Entity>, projection?: ProjectionType<Entity>): Promise<Entity | null>;

  insertOne(entity: Entity): Promise<InsertOneWriteOpResult<any>>;
  insertMany(entities: Entity[]): Promise<InsertWriteOpResult<any>>;

  updateOne(id: Identification, fields: UpdateQuery<Entity>): Promise<UpdateWriteOpResult>;
  updateOne(query: FilterQuery<Entity>, fields: UpdateQuery<Entity>): Promise<UpdateWriteOpResult>;
}

import { Db, MongoClient } from "mongodb";
import { mongoLoginInformation } from "../config/mongoLoginInformation";

export default function getMongoDb(): Promise<Db> {
  return new Promise((resolve, reject) => {
    MongoClient.connect(mongoLoginInformation.connectUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        console.log("Connected to the mongo db");
        resolve(result.db("programata"));
      }
    });
  });
}

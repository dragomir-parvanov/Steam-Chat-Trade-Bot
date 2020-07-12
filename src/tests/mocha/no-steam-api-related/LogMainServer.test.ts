// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mocha, { expect } from "chai";
import log from "../../../classes/logger/Log";
import { Db, MongoClient } from "mongodb";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";

import LogErrorModel from "../../../classes/logger/LogErrorModel";
import LogWarningModel from "../../../classes/logger/LogWarningModel";
import LogNormalModel from "../../../classes/logger/LogNormalModel";
import configureMainServerLogger from "../../../main-server/src/config/configurators/configureMainServerLogger";

const errorService = new DbServiceBase<LogErrorModel>(EMongoDbCollectionNames.MainErrorLogs);
const warningService = new DbServiceBase<LogWarningModel>(EMongoDbCollectionNames.MainWarningLogs);
const normalService = new DbServiceBase<LogNormalModel>(EMongoDbCollectionNames.MainNormalLogs);

describe("Logger main server test", () => {
  let db: Db;
  before(function () {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    return new Promise((resolve) => {
      MongoClient.connect("mongodb://localhost:27017/", options).then(async (mongoClient) => {
        db = mongoClient.db("programataTest");
        await db.dropCollection(EMongoDbCollectionNames[EMongoDbCollectionNames.MainErrorLogs]).catch(() => console.log("cannot drop collection"));
        await db.dropCollection(EMongoDbCollectionNames[EMongoDbCollectionNames.MainNormalLogs]).catch(() => console.log("cannot drop collection"));
        await db.dropCollection(EMongoDbCollectionNames[EMongoDbCollectionNames.MainWarningLogs]).catch(() => console.log("cannot drop collection"));
        DbServiceBase.db = db;
        configureMainServerLogger(db);
        resolve();
      });
    });
  });
  it("Loggin an error", async () => {
    const errorMessage = "testErrorMessage";
    const error = new Error(errorMessage);
    const additionalMessage = "testAdditionalMessage";
    await log.error(error, additionalMessage);

    const doc = await errorService.findOne({ additionalMessage: additionalMessage });

    if (!doc) {
      throw new Error("Log not found");
    }
    expect(doc.additionalMessage).eq(additionalMessage);
    expect(doc.error.message).eq(errorMessage);
  });
  it("Loggin a warning", async () => {
    const object = { testKey: "testValue" };
    const additionalMessage = ["warning with some object", object];
    await log.warn(additionalMessage, 1);

    const doc = await warningService.findOne({});
    if (!doc) {
      throw new Error("Log not found");
    }

    expect(doc.level).eq(1);
    expect(JSON.stringify(doc.additionalMessage)).eq(JSON.stringify(additionalMessage));
  });

  it("Loggin a normal log", async () => {
    const message = "normal log";
    await log.do(message);
    const doc = await normalService.findOne({});

    if (!doc) {
      throw new Error("Log not found");
    }
    expect(doc.additionalMessage).eq(message);
  });
});

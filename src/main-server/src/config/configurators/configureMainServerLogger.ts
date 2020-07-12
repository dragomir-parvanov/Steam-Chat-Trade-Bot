import log from "../../../../classes/logger/Log";
import { ELoggerEnviroment } from "../../../../classes/logger/ELoggerEnviroment";
import { Db } from "mongodb";
import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";
import LogErrorModel from "../../../../classes/logger/LogErrorModel";
import { ELogType } from "../../../../classes/logger/ELogType";
import LogNormalModel from "../../../../classes/logger/LogNormalModel";
import LogWarningModel from "../../../../classes/logger/LogWarningModel";

export default function configureMainServerLogger(mongoDb: Db): void {
    DbServiceBase.db = mongoDb
    log.enviroment = ELoggerEnviroment.Main
    const errorService = new DbServiceBase<LogErrorModel>(EMongoDbCollectionNames.MainErrorLogs)
    const warningService = new DbServiceBase<LogWarningModel>(EMongoDbCollectionNames.MainWarningLogs)
    const normalService = new DbServiceBase<LogNormalModel>(EMongoDbCollectionNames.MainNormalLogs)
    log.handleLog = async (log: LogErrorModel | LogNormalModel | LogWarningModel, logType: ELogType): Promise<void> => {
        if (logType === ELogType.Warning) {

            await warningService.insertOne(log = log as LogWarningModel)
        }
        if (logType === ELogType.Error) {

            await errorService.insertOne(log as LogErrorModel)
        }

        if (logType === ELogType.Normal) {

            await normalService.insertOne(log as LogNormalModel)
        }
    };
    log.init()
}
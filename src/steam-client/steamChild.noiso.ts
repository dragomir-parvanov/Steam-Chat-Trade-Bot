/* DEPRECATED, now we don't spawn each nodejs instance per steam child */

require("dotenv").config();
import onProcessMessageReceivedHandler from "../shared-network/ipc/functions/onProcessMessageReceivedHandler";
import bindIPCRequestReceiverHandler from "../shared-network/ipc/functions/bindIPCRequestReceiverHandler";
import createProcessSender from "../shared-network/ipc/functions/createProcessSender";

import { ELoggerEnviroment } from "../classes/logger/ELoggerEnviroment";
import log from "../classes/logger/Log";
import { steamClientRouter } from "../shared-network/ipc/ipc-routes/steam-client/steamClientIPCRouter";
import { o_IPCResponsesStream } from "../shared-network/ipc/observables/o_IPCResponsesStream";
import { o_IPCRequestsStream } from "../shared-network/ipc/observables/o_IPCRequestsStream";
import getMongoDb from "../data/functions/getMongoDb";
import DbServiceBase from "../data/services/Base/DbServiceBase";
import configureMainServerLogger from "../main-server/src/config/configurators/configureMainServerLogger";

getMongoDb().then((db) => {
  DbServiceBase.db = db;
  configureMainServerLogger(db);
});

const processSender = createProcessSender(process);

bindIPCRequestReceiverHandler(steamClientRouter, o_IPCRequestsStream, processSender);

// WARNING: this must be here, dont move this and dont add any lines inside!
// even adding console.log inside causes unintended behaviour when this gets called.
process.on("message", (message) => {
  onProcessMessageReceivedHandler(o_IPCRequestsStream, o_IPCResponsesStream, message);
});

// logger initialization
log.enviroment = ELoggerEnviroment.SteamClient;
//log.clientId = g_currentClientId;
log.mainServerUrl = "www.test.com";
log.init();

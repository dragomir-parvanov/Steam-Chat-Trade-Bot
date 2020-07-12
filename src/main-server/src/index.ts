require("dotenv").config();
import executionTimestamp from "../../functions/executionTimestamp";
console.log("execution time is", executionTimestamp);
import express from "express";
import expressSession from "express-session";
import { expressSecret } from "./config/static/express/expressSecret";
import { expressListenPort } from "./config/static/express/expressListenPort";
import DbServiceBase from "../../data/services/Base/DbServiceBase";
import configureMainServerLogger from "./config/configurators/configureMainServerLogger";
import getMongoDb from "../../data/functions/getMongoDb";
import configurePassport from "./passport/configurePassport";
import authenticateRoute from "./routes/authentication/authenticateRoute";
import cors from "cors";
import main_bindUpdaters from "./main_bindUpdaters";
import main_furorRouter from "../../shared-network/express-function-router/routers/main/main_furorRouter";
import createExpressFunctionRouter from "../../shared-network/express-function-router/createExpressFunctionRouter";
import MAIN_SERVER_URL from "../../shared-network/constants/to-main/MAIN_SERVER_URL";
import fs from "fs";
import path from "path";
import http from "http";
import configureSocketIO from "./config/configurators/configureSocketIO";
import httpProxy from "http-proxy";
import { SteamId64 } from "../../models/types/SteamId64";
import { createProxyMiddleware } from "http-proxy-middleware";
import createSteamChild from "./functions/childs/createSteamChild";
import initializeMarket from "./functions/childs/market/initializeMarket";

console.log("enviroment variables test", process.env["SOME_VAR"], process.env.NODE_ENV);
getMongoDb().then((db) => {
  DbServiceBase.db = db;
  configureMainServerLogger(db);
  initializeMarket();
  // if (process.env.NODE_ENV !== "production") createSteamChild("76561198203198914");
});

const app = express();

app.use(cors({ credentials: true, origin: MAIN_SERVER_URL }));

// Express body parser
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const sessionMiddleware = expressSession({
  secret: expressSecret,
  resave: true,
  saveUninitialized: true,
});

// Express session
app.use(sessionMiddleware);

configurePassport(app);

app.use("/auth", authenticateRoute);

//app.use("/api/proxy", steamAccountProxyRouter);
// app.use("/api/proxy", (req, res) => {
//   req.header("Access-Control-Allow-Origin: *");
//   const query = (req.query as never) as SteamAccountProxyQuery;

//   const cookies = g_steamCookies[query.clientId]?.getValue();

//   if (!cookies) {
//     throw new LogError(`Cookies not found for account with id ${query.clientId}`);
//   }

//   cookies.forEach((c) => {
//     const split = c.split("=");

//     const name = split[0];
//     const value = split[1];

//     res.cookie(name, value);
//   });
//   proxy.web(req, res, {
//     target: query.proxyUrl as any,
//     changeOrigin: true,
//     ws: true,
//   });
// });
//configureSteamProxy(app);

app.get("/heartbeat", (req, res) => {
  console.log("heartbeat received");
  res.send();
});

//react configuration
app.use(express.static(path.resolve(__dirname + "../../../../build/")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname + "../../../../build/index.html"));
});

main_bindUpdaters();

const functionRouter = createExpressFunctionRouter(main_furorRouter);

app.use("/furor", functionRouter);
console.log("Enviroment variable", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  const certificate = (() => {
    return {
      key: fs.readFileSync(`/etc/letsencrypt/live/hidden/privkey.pem`, "utf8"),
      cert: fs.readFileSync(`/etc/letsencrypt/live/hidden/cert.pem`, "utf8"),
      ca: fs.readFileSync(`/etc/letsencrypt/live/hidden/chain.pem`, "utf8"),
    };
  })();
  const httpsServer = require("https").Server(certificate, app);
  httpsServer.listen(443, function (err) {
    if (err) return console.log(err);
    console.log("Listening at https://%s:%s", "localhost", 443);
  });
  configureSocketIO(httpsServer, sessionMiddleware);
} else {
  const { Server } = http;
  const httpServer = new Server(app);

  httpServer.listen(expressListenPort, function () {
    console.log("Listening at http://%s:%s", "localhost", expressListenPort);
  });

  configureSocketIO(httpServer, sessionMiddleware);
}

import { Router } from "express";
import LogError from "../../../../classes/errors/base/LogError";
import SteamAccountProxyQuery from "../../../../shared-network/models/web/queries/SteamAccountProxyQuery";
import g_steamInstancesStores from "../../../../steam-client/globals/g_steamInstancesStores";
import g_steamCookies from "../../../../steam-client/steam-login/user/config/g_steamCookies";

const router = Router();

router.use("/", (req, res) => {
  if (req.method !== "POST" && req.method !== "GET") {
    throw new LogError(`We received another method, which is not post or get, method name ${req.method}`, ["request object", req]);
  }
  req.header("Access-Control-Allow-Origin: *");
  const query = (req.query as never) as SteamAccountProxyQuery;

  if (!query.clientId) {
    console.log(req.originalUrl);
    console.log(req.url);
    console.log(req.baseUrl);
    console.log(query);
    throw new Error(`client id in query is not present`);
  }
  const community = g_steamInstancesStores[query.clientId]?.community;

  if (!community) {
    throw new LogError(`Community not found for steam client id ${query.clientId}`);
  }
  const options: any = {
    uri: query.proxyUrl,
  };

  if (req.body) {
    options.formData = req.body;
  }
  switch (req.method) {
    case "POST":
      community
        .httpRequestPost(options)
        .then((result) => {
          res.send(result.body);
        })
        .catch((err) => {
          res.status(500).send(`${err}`);
        });
    case "GET":
      community
        .httpRequestGet(options)
        .then((result) => {
          res.send(result.body);
        })
        .catch((err) => {
          res.status(500).send(`${err}`);
        });
  }
});

const steamAccountProxyRouter = router;

export default steamAccountProxyRouter;

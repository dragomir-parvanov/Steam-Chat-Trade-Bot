import express, { query } from "express";
import httpProxy from "http-proxy";
import g_clientWorkersInformation from "../../globals/g_clientWorkersInformation";
import { SteamId64 } from "../../../../models/types/SteamId64";
import g_steamCookies from "../../../../steam-client/steam-login/user/config/g_steamCookies";
import LogError from "../../../../classes/errors/base/LogError";
export default function configureSteamProxy(app: ReturnType<typeof express>) {
  const proxy = httpProxy.createProxyServer();
  app.use("*", (req, res, next) => {
    const clientId = req.headers["client-id"] as SteamId64;
    const proxyUrl = req.headers["proxy-url"] as string;
    console.log(proxyUrl, clientId);
    if (clientId && proxyUrl) {
      const client = g_clientWorkersInformation[clientId];

      const cookies = g_steamCookies[clientId]?.getValue();

      if (!cookies) {
        throw new LogError(`Cookies not found for account with id ${clientId}`);
      }

      cookies.forEach((c) => {
        const split = c.split("=");

        const name = split[0];
        const value = split[1];

        res.cookie(name, value);
      });
      const cookiesString = cookies.join(";");
      res.header("Cookie", cookiesString);
      if (!client) {
        res.status(500).send(`Steam client with id ${clientId} is not found`);
      }

      proxy.web(req, res, { target: proxyUrl, autoRewrite: true, changeOrigin: true });
    } else {
      next();
    }
  });
}

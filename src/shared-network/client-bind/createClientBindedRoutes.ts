import { SteamId64 } from "../../models/types/SteamId64";
import client_clientRouter from "./router/client_clientRouter";
import ToClientMessageModel from "./models/ToClientMessageModel";
import ImplementedBindRouterType from "./models/ImplementedBindRouterType";

export default function createClientBindedRoutes(clientId: SteamId64) {
  const implementedRouter: ImplementedBindRouterType<typeof client_clientRouter> = {} as any;
  const toClienMessage: ToClientMessageModel = { clientId };
  for (const key in client_clientRouter) {
    implementedRouter[key] = function (...args: unknown[]) {
      const functionResult = client_clientRouter[key].apply(toClienMessage, args);
      return functionResult;
    };
  }

  return implementedRouter as ImplementedBindRouterType;
}

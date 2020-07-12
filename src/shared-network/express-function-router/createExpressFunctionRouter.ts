import ExpressFunctionRouter, { ExpressFunctionNode } from "./ExpressFunctionRouter";
import _ from "lodash";
import LogError from "../../classes/errors/base/LogError";
import { Router, RequestHandler } from "express";

export function createMiddlewareFromFunction(this: any, node: ExpressFunctionNode) {
  const router = Router();
  const requestHandler: RequestHandler = async (req, res) => {
    const body = (req.body as [] | null) ?? [];
    let response;
    try {
      response = node.shouldBindRequest ? await node.func.call(req, ...body) : await node.func(...body);
      res.json(response);
    } catch (error) {
      console.log("Error in furor router", error);
      res.status(500).send(`${error}`);
    }
  };
  //router[EHTTPMethods[node.type]]("/path", ...(node.middlewaresBefore ?? []), requestHandler);
  if (!node.middlewaresBefore) node.middlewaresBefore = [];

  router.post("/", ...node.middlewaresBefore, requestHandler);
  return router;
}

export default function createExpressFunctionRouter<R extends ExpressFunctionRouter>(router: R) {
  function recur(r: ExpressFunctionRouter, path: string) {
    const router = Router();

    const keys = Object.keys(r);
    const [functions, routers] = (_.partition(keys, (k) => k === "type" || k === "func" || k === "shouldBindRequest" || k === "middlewaresBefore") as never) as [
      Array<keyof ExpressFunctionNode>,
      string[]
    ];
    if (functions.length === 1) {
      throw new LogError(`Function arguments are not 0 or 2 or 3 in count, real count is 1`);
    }
    if (functions.length > 0 && routers.length > 0) {
      throw new LogError(`In one route, there cannot be node http implementation, and another router`);
    }

    // building the express function
    if (functions.length > 0) {
      const implementedRouter = createMiddlewareFromFunction((r as never) as ExpressFunctionNode);
      router.use(implementedRouter);
      return router;
    }

    for (const route of routers) {
      const implementedRouter = recur(r[route] as ExpressFunctionRouter, route);
      const routerPath = "/" + route;
      router.use(routerPath, implementedRouter);
    }
    return router;
  }
  return recur(router, "/");
}

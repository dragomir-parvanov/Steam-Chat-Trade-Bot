import EHTTPMethods from "../../models/enums/EHTTPMethods";
import { RequestHandler } from "express";
import { FunctionWithTypedReturn } from "../../models/types/PromisifiedObjectFunctions";
import Invalid from "../../models/types/Invalid";

type ExpressFunctionRouter = {
  [route: string]: ExpressFunctionRouter | ExpressFunctionNode;
};

export type ExpressFunctionNode = {
  type: EHTTPMethods;
  func: FunctionWithTypedReturn;
  middlewaresBefore?: RequestHandler[];
  shouldBindRequest?: boolean;
};

/**
 *  Resolving items from the client, this hides the type and the middleware and only exposes the function.
 */
// sadly we have to be hacky again, since typescript doesn't believe T[route] will be ExpressFunctionResolver, so we  have to extend it to satisfy typescript transpiller.
export type ExpressFunctionResolver<T extends ExpressFunctionRouter> = {
  [route in keyof T]: T[route] extends ExpressFunctionNode
    ? ReturnType<T[route]["func"]> extends Promise<any>
      ? OmitThisParameter<T[route]["func"]>
      : (...args: Parameters<T[route]["func"]>) => Promise<ReturnType<T[route]["func"]>>
    : T[route] extends ExpressFunctionResolver<any>
    ? ExpressFunctionResolver<T[route]>
    : Invalid<"Not type of ExpressFunctionResolver<any>">;
};
export type ExpressFunctionResolverTemplate<R extends ExpressFunctionRouter> = {
  [route in keyof R]: R[route] extends ExpressFunctionNode
    ? R[route]["type"]
    : R[route] extends ExpressFunctionResolverTemplate<any>
    ? ExpressFunctionResolverTemplate<R[route]>
    : Invalid<"Route is not type of ExpressFunctionResolverTemplate<any>">;
};

export default ExpressFunctionRouter;

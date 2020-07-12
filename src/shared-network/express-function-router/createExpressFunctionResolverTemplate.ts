import ExpressFunctionRouter, { ExpressFunctionResolver, ExpressFunctionResolverTemplate, ExpressFunctionNode } from "./ExpressFunctionRouter";

/**
 * Templating the router, so we don't have to store the whole router object with all the back-end functions on the front-end side.
 * @param router
 */
export default function createExpressFunctionResolverTemplate<R extends ExpressFunctionRouter>(router: R): ExpressFunctionResolverTemplate<typeof router> {
  function recur(r: ExpressFunctionRouter) {
    const template: ExpressFunctionResolverTemplate<any> = {};
    if ("type" in r) {
      const node = (r as never) as ExpressFunctionNode;

      return node.type as never;
    } else {
      for (const key in r) {
        const router = (r[key] as never) as ExpressFunctionRouter;
        const result = recur(router);
        template[key] = result;
      }
    }
    return template;
  }
  return recur(router);
}

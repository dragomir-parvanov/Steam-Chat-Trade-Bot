import ExpressFunctionRouter, { ExpressFunctionResolverTemplate, ExpressFunctionResolver } from "./ExpressFunctionRouter";
import Axios from "axios";
import EHTTPMethods from "../../models/enums/EHTTPMethods";
import MAIN_SERVER_URL from "../constants/to-main/MAIN_SERVER_URL";

// detecting if browser
const prevPath = typeof window === "undefined" ? MAIN_SERVER_URL : "";
console.log("prevPath", prevPath);
export function createHTTPResolver(path: string, type: EHTTPMethods) {
  return async function (...functionArguments: any) {
    const result = await Axios.post(prevPath + path, functionArguments, { withCredentials: true });
    return result.data;
  };
}

export default function createExpressFunctionResolver<T extends ExpressFunctionRouter>(
  router: ExpressFunctionResolverTemplate<any>,
  path: string = ""
): ExpressFunctionResolver<T> {
  function recur(r: ExpressFunctionResolverTemplate<any>, path: string) {
    const result: ExpressFunctionResolver<typeof r> = {};
    for (const key in r) {
      if (typeof r[key] === "object") {
        result[key] = recur(r[key], path + "/" + key);
      } else {
        result[key] = createHTTPResolver(path + "/" + key, r[key]) as never;
      }
    }
    return result;
  }
  return recur(router, path);
}

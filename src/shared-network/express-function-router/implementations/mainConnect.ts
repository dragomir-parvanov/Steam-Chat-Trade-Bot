import createExpressFunctionResolver from "../createExpressFunctionResolver";
import mainFunctionRouterTemplate from "./mainFunctionRouterTemplate.json";
import main_furorRouter from "../routers/main/main_furorRouter";

const mainConnect = createExpressFunctionResolver<typeof main_furorRouter>(mainFunctionRouterTemplate, "/furor");

export default mainConnect;

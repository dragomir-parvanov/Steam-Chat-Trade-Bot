import createExpressFunctionResolverTemplate from "../createExpressFunctionResolverTemplate";
import main_furorRouter from "../routers/main/main_furorRouter";
import { writeFile, writeFileSync } from "fs";
console.log("before create");
const template = createExpressFunctionResolverTemplate(main_furorRouter);
writeFileSync(__dirname + "/mainFunctionRouterTemplate.json", JSON.stringify(template, null, 2));
console.log(template);

import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import { main_chatFurorRouter } from "./main_chatFurorRouter";
import createExpressFunctionResolverTemplate from "../../createExpressFunctionResolverTemplate";
import main_clientFurorRouter from "./main_clientFurorRouter";
import main_itemsFurorRouter from "./main_itemsFurorRouter";
import main_miningFurorRouter from "./main_miningFurorRouter";
import main_authFurorRouter from "./main_authFurorRouter";
import main_marketFurorRouter from "./main_marketFurorRouter";

const main_furorRouter = validateType<ExpressFunctionRouter>()({
  chats: main_chatFurorRouter,
  clients: main_clientFurorRouter,
  mining: main_miningFurorRouter,
  items: main_itemsFurorRouter,
  market: main_marketFurorRouter,
  auth: main_authFurorRouter,
});
export default main_furorRouter;

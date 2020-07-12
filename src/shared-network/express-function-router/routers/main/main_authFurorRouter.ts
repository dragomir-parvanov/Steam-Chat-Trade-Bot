import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import EHTTPMethods from "../../../../models/enums/EHTTPMethods";
import checkUserClaims from "../../../../main-server/src/passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import { fr_getWorkerNames } from "../../../../main-server/src/routes/authentication/managementAuthenticationRoute";

const main_authFurorRouter = validateType<ExpressFunctionRouter>()({
  management: { getWorkerNames: { type: EHTTPMethods.get, middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.Admin)], func: fr_getWorkerNames } },
});

export default main_authFurorRouter;

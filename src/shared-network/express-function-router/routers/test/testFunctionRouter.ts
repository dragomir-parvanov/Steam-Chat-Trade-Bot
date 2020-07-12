import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import EHTTPMethods from "../../../../models/enums/EHTTPMethods";
import checkUserClaims from "../../../../main-server/src/passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";

const testFunctionRouter = validateType<ExpressFunctionRouter>()({
  multipleByTwo: {
    type: EHTTPMethods.get,
    func: (num: number) => num * 2,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.Admin)],
  },
  nested: {
    powOnTwo: {
      type: EHTTPMethods.get,
      func: (num: number) => num ** 2,
    },
  },
  deepNested: {
    nested: {
      moreNested: {
        multipleByThree: {
          func: (num: number) => num * 3,
          type: EHTTPMethods.get,
        },
      },
    },
  },
});

export default testFunctionRouter;

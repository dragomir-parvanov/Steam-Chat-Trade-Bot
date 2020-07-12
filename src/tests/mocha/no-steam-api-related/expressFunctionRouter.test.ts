import mocha, { expect } from "chai";
import validateType from "../../../functions/validateType";
import ExpressFunctionRouter, { ExpressFunctionResolverTemplate } from "../../../shared-network/express-function-router/ExpressFunctionRouter";
import EHTTPMethods from "../../../models/enums/EHTTPMethods";
import createExpressFunctionResolverTemplate from "../../../shared-network/express-function-router/createExpressFunctionResolverTemplate";

describe("express function router", () => {
  it("create express function resolver template", () => {
    const router = validateType<ExpressFunctionRouter>()({
      test: {
        type: EHTTPMethods.get,
        func: (asd: string) => 3,
      },
      basd: {
        ghfh: {
          type: EHTTPMethods.patch,
          func: (sds: string) => 5,
        },
        rtyrty: {
          gfhj: {
            type: EHTTPMethods.get,
            func: (sdf: string) => 5,
          },
          trey: {
            gfhgjk: {
              type: EHTTPMethods.post,
              func: (asg: number) => 7,
            },
          },
        },
      },
    });

    const expectedTemplate: ExpressFunctionResolverTemplate<typeof router> = {
      test: EHTTPMethods.get,
      basd: {
        ghfh: EHTTPMethods.patch,
        rtyrty: {
          gfhj: EHTTPMethods.get,
          trey: {
            gfhgjk: EHTTPMethods.post,
          },
        },
      },
    };

    const result = createExpressFunctionResolverTemplate(router);

    expect(result).deep.eq(expectedTemplate);
  });
});

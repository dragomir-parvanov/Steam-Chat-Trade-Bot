import mocha, { expect } from "chai";
import { EXPECTED_PARSED_MARKET_RESPONSE } from "../../entities/market/EXPECTED_PARSED_MARKET_RESPONSE";
import parseMarketListingPage from "../../../functions/steam/steam-market/parseMarketListingPage";
import marketPageResponse from "../../entities/market/test-market-page-response.json";
describe("parse market listings", () => {
  it("parse market page", () => {
    const apiResult = marketPageResponse;
    const result = parseMarketListingPage(apiResult);
    const expected = EXPECTED_PARSED_MARKET_RESPONSE;

    expect(result).deep.eq(expected);
  });
});

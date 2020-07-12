import mocha, { expect } from "chai";
import extractPartnerSteamId64FromTradeOfferLink from "../../../functions/steam/extractPartnerSteamId64FromTradeOfferLink";

describe("extractPartnerSteamId64FromTradeOfferLink.test", () => {
  it("test", () => {
    const tradeOfferLink = `https://steamcommunity.com/tradeoffer/new/?partner=118442543&token=z6L05zka`;
    const result = extractPartnerSteamId64FromTradeOfferLink(tradeOfferLink);

    expect(result).eq("76561198078708271");
  });
});

/* eslint-disable @typescript-eslint/camelcase */
import mocha, { expect } from "chai";
import createItemSellInformationParsedSteamAPIModel, {
  parseMarketPrice,
  parseVolume,
} from "../../../factories/ItemSellInformationParsedSteamAPIModel";
import ItemSellInformationSteamAPIModel from "../../../models/models/steam/steam-market/steamAPI/ItemSellInformationSteamAPIModel";
import ItemSellInformationParsedSteamAPIModel from "../../../models/models/steam/steam-items/ItemSellInformationParsedSteamAPIModel";

describe("Testing createItemWithPriceModel factory", () => {
  it("parsePrice()", () => {
    expect(parseMarketPrice("1,--€")).to.eq(1);
    expect(parseMarketPrice()).to.eq(0);
    expect(parseMarketPrice("1,23€")).to.eq(1.23);

    expect(parseMarketPrice("$0.15 USD")).to.eq(0.15);
  });
  it("parseVolume()", () => {
    expect(parseVolume("1,000,000 ")).to.eq(1000000);
    expect(parseVolume("100")).to.eq(100);
    expect(parseVolume()).to.eq(0);
  });
  it("1-createItemWithPriceModel()", () => {
    const apiResponse: ItemSellInformationSteamAPIModel = {
      success: true,
      lowest_price: "1,--$",
      median_price: "0,99$",
    };

    const result = createItemSellInformationParsedSteamAPIModel("AWP | Safari Mesh (Field-Tested)", apiResponse);

    const expectedResult: ItemSellInformationParsedSteamAPIModel = {
      _id: "AWP | Safari Mesh (Field-Tested)",
      lowestPrice: 1,
      averagePrice: 0.99,
      volume: 0,
    };
    expect(result).deep.eq(expectedResult);
  });

  it("2-createItemWithPriceModel()", () => {
    const apiResponse: ItemSellInformationSteamAPIModel = {
      success: true,
      median_price: "0,99$",
    };

    const result = createItemSellInformationParsedSteamAPIModel("AWP | Safari Mesh (Field-Tested)", apiResponse);

    const expectedResult: ItemSellInformationParsedSteamAPIModel = {
      _id: "AWP | Safari Mesh (Field-Tested)",
      lowestPrice: 0,
      averagePrice: 0.99,
      volume: 0,
    };
    expect(result).to.deep.eq(expectedResult);
  });
  it("create parsed item with price 0.06", () => {
    const apiResponse: ItemSellInformationSteamAPIModel = {
      success: true,
      median_price: "0,06",
      lowest_price: "0,07",
      volume: "1000,000",
    };
    const result = createItemSellInformationParsedSteamAPIModel("AWP | Safari Mesh (Field-Tested)", apiResponse);

    const expectedResult: ItemSellInformationParsedSteamAPIModel = {
      _id: "AWP | Safari Mesh (Field-Tested)",
      lowestPrice: 0.07,
      averagePrice: 0.06,
      volume: 1000000,
    };
    expect(result).to.deep.eq(expectedResult);
  });
});

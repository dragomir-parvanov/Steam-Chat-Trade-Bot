/* eslint-disable @typescript-eslint/no-unused-vars */
import mocha, { expect } from "chai";
import promisifySteamCommunity from "../../../functions/promisify/promisifySteamCommunity";
import SteamCommunity from "steamcommunity";
import tryy from "../../../functions/tryy/tryy";
import SteamID from "steamid";
import { EPrivacyState } from "../../../models/enums/EPrivacyState";
import createParsedItem from "../../../factories/createParsedItem";
import { ECSGOItemExteriorCondition } from "../../../models/enums/ECSGOItemWearCondition";
import XMLParsedProfileModel from "../../../models/models/steam/steam-profiles/XMLParsedProfileModel";
const community = promisifySteamCommunity(new SteamCommunity());
describe("promisifySteamCommunity", () => {
  it("getSteamUser()", async () => {
    const result = await tryy(
      {
        maxRetries: 5,
        waitOnFail: 1000,
      },
      async () => {
        return await community.getSteamUser(new SteamID("76561198078708271"));
      }
    ).catch((error) => {
      console.log(error);
      return {} as XMLParsedProfileModel;
    });
    expect(result.steamID.getSteamID64()).eq("76561198078708271");
    expect(result.isLimitedAccount).to.eq(false);
    expect(result.memberSince?.getFullYear()).equal(2012);
    expect(result.memberSince?.getDate()).eq(18);
    expect(result.vacBanned).equal(false);
    expect(result.tradeBanState).equal("None");
    expect(result.privacyState).equal(EPrivacyState.Public);
    expect(result.visibilityState).equal("3");
  });

  it("getUserInventoryContents()", async () => {
    const inventory = await tryy({ maxRetries: 5, waitOnFail: 1000 }, async () => {
      return await community.getUserInventoryContents(new SteamID("76561198078708271"), 730, 2, false);
    });
    const parsedInventory = inventory.map((i) => createParsedItem(i));
    // operation bravo coin
    const lastItem = parsedInventory[parsedInventory.length - 1];
    expect(lastItem.marketHashName).to.equal("Silver Operation Bravo Coin");
    expect(lastItem.itemName).to.equal("Silver Operation Bravo Coin");
    expect(lastItem.isStattrak).equal(false);
    expect(lastItem.isTradable).equal(false);
    expect(lastItem.stickers.length).equal(0);
    expect(lastItem.exteriorCondition).equal(ECSGOItemExteriorCondition.NoWear);
    expect(lastItem.isStattrak).equal(false);
    expect(lastItem.appId).to.equal(730);
  });
});

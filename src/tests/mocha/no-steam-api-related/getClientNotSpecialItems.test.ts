import mocha, { expect, use } from "chai";
import { MongoClient, BulkWriteOperation } from "mongodb";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import SentItemsInOffersModel from "../../../steam-client/models/SentItemsInOffersModel";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import notSpecialMP7 from "../../entities/parsedItems/notSpecialMP7";
import notSpecialAWPSafari from "../../entities/parsedItems/notSpecialAWPSafari";
import getClientNotSpecialItems from "../../../steam-client/functions/offers/getClientNotSpecialItems";
import { NotSpecialItemsInTradOfferModel } from "../../../models/models/steam/steam-offers/SendTradeOfferModel";
import chaiAsPromised from "chai-as-promised";
import AssetId from "../../../models/types/AssetId";
import revertNotSpecialItemsDbOperation from "../../../steam-client/functions/offers/revertNotSpecialItemsDbOperation";

use(chaiAsPromised);
const db = new DbServiceBase<SentItemsInOffersModel>(EMongoDbCollectionNames.SentItemsInOffers);

describe("getClientNotSpecialItems()", () => {
  before(function () {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    return new Promise((resolve) => {
      MongoClient.connect("mongodb://localhost:27017/", options).then(async (mongoClient) => {
        const db = mongoClient.db("programataTest");
        await db
          .dropCollection(EMongoDbCollectionNames[EMongoDbCollectionNames.SentItemsInOffers])
          .catch(() => console.log("cannot drop collection"));
        DbServiceBase.db = db;
        resolve();
      });
    });
  });

  it("BulkWrite with updateOne upsert", async () => {
    const db = new DbServiceBase<SentItemsInOffersModel>(EMongoDbCollectionNames.SentItemsInOffers);

    const operations: BulkWriteOperation<SentItemsInOffersModel>[] = [];

    const docs: SentItemsInOffersModel[] = [
      { items: [], clientId: "testClientId", marketHashName: "testItemName1" },
      { items: [], clientId: "testClientId", marketHashName: "testItemName2" },
    ];

    docs.forEach((d) => {
      const query = { clientId: d.clientId, marketHashName: d.marketHashName };
      operations.push({ updateOne: { filter: query, update: { $set: d }, upsert: true } });
    });
    await db.bulkWrite(operations);

    const cursor = await db.findMany({ marketHashName: { $in: ["testItemName1", "testItemName2"] }, clientId: "testClientId" });

    const dbDocs = await cursor.toArray();

    const firstDoc = dbDocs.find((i) => i.marketHashName === "testItemName1");
    if (!firstDoc) {
      throw new Error("first doc not found");
    }

    const secondDoc = dbDocs.find((i) => i.marketHashName === "testItemName2");
    if (!secondDoc) {
      throw new Error("second doc not found");
    }
    expect(firstDoc.marketHashName).eq("testItemName1");
    expect(secondDoc.marketHashName).eq("testItemName2");
  });

  it("should throw error", async () => {
    const mp7 = notSpecialMP7;

    const awpSafari = notSpecialAWPSafari;

    const clientInventory: ParsedItemModel[] = [mp7, awpSafari];
    const neededCount = 2;
    const neededItems: NotSpecialItemsInTradOfferModel[] = [{ marketHashName: awpSafari.marketHashName, count: neededCount }];
    const first = getClientNotSpecialItems(neededItems, clientInventory, "testClientId", "testPartnerId");
    await expect(first).to.be.rejectedWith(Error, `We have ${1} ${awpSafari.marketHashName} but we need ${neededCount}`);
    neededItems.push({ marketHashName: "AWP DRAGON LORE", count: 5 });
    await expect(getClientNotSpecialItems(neededItems, clientInventory, "testClientId", "testPartnerId")).to.be.rejectedWith(Error);
  });
  it("multiple operations", async () => {
    // inventory with 2 items
    const clientId = "testClientId2";
    const partnerId = "testPartnerId";
    let clientInventory: ParsedItemModel[] = [
      { ...notSpecialAWPSafari, assetId: "1" },
      { ...notSpecialAWPSafari, assetId: "2" },
      { ...notSpecialMP7, assetId: "3" },
      { ...notSpecialMP7, assetId: "4" },
    ];

    const awpName = "AWP | Safari Mesh (Minimal-Wear)";
    const mp7Name = "MP7 | Scorched (Battle-Scarred)";

    let result: SentItemsInOffersModel[];
    // first sending an offer
    const firstNeed: NotSpecialItemsInTradOfferModel[] = [
      { marketHashName: awpName, count: 1 },
      { marketHashName: mp7Name, count: 1 },
    ];
    await getClientNotSpecialItems(firstNeed, clientInventory, clientId, partnerId);
    // waiting because mongodb might not have inserted the doc
    //await wait(1000);
    let firstDoc = await db.findOne({ clientId, marketHashName: awpName });

    let secondDoc = await db.findOne({ clientId, marketHashName: mp7Name });

    if (!firstDoc || !secondDoc) {
      throw new Error("Documents not found");
    }

    expect(firstDoc.items.pop()?.assetId).to.eq("1", "first offer");

    expect(secondDoc.items.pop()?.assetId).to.eq("3", "first offer");

    // second sending same offer
    result = await getClientNotSpecialItems(firstNeed, clientInventory, clientId, partnerId);

    // waiting because mongodb might not have inserted the doc
    //await wait(1000);
    firstDoc = await db.findOne({ clientId, marketHashName: awpName });

    secondDoc = await db.findOne({ clientId, marketHashName: mp7Name });

    if (!firstDoc || !secondDoc) {
      throw new Error("Documents not found");
    }

    expect(firstDoc?.items.pop()?.assetId).to.eq("2", "second offer");

    expect(secondDoc?.items.pop()?.assetId).to.eq("4", "second offer");

    let firstItem = result.find((i) => i.marketHashName === awpName);
    let secondItem = result.find((i) => i.marketHashName === mp7Name);
    expect(firstItem?.items.pop()?.assetId).eq("2");
    expect(secondItem?.items.pop()?.assetId).eq("4");

    // third sending the same offer
    result = await getClientNotSpecialItems(firstNeed, clientInventory, clientId, partnerId);
    // waiting because mongodb might not have inserted the doc
    //await wait(1000);
    firstDoc = await db.findOne({ clientId, marketHashName: awpName });

    secondDoc = await db.findOne({ clientId, marketHashName: mp7Name });

    if (!firstDoc || !secondDoc) {
      throw new Error("Documents not found");
    }

    expect(firstDoc?.items.pop()?.assetId).to.eq("1", "third offer");

    expect(secondDoc?.items.pop()?.assetId).to.eq("3", "third offer");

    firstItem = result.find((i) => i.marketHashName === awpName);
    secondItem = result.find((i) => i.marketHashName === mp7Name);
    expect(firstItem?.items.pop()?.assetId).eq("1");
    expect(secondItem?.items.pop()?.assetId).eq("3");

    // fourth sending 2 same items
    const secondNeed: NotSpecialItemsInTradOfferModel[] = [
      { marketHashName: awpName, count: 2 },
      { marketHashName: mp7Name, count: 2 },
    ];

    // adding items to the inventory
    clientInventory.push({ ...notSpecialMP7, assetId: "6" }, { ...notSpecialAWPSafari, assetId: "5" });

    result = await getClientNotSpecialItems(secondNeed, clientInventory, clientId, partnerId);

    let expectedResult: AssetId[] = ["2", "4", "5", "6"];
    let assetsResult: AssetId[] = [];
    result.forEach((r) => {
      assetsResult.push(...r.items.map((i) => i.assetId));
    });
    expect(assetsResult).deep.members(expectedResult);

    // removing item from inventory
    clientInventory = clientInventory.filter((i) => i.assetId !== "5");

    const thirdNeed: NotSpecialItemsInTradOfferModel[] = [
      { marketHashName: awpName, count: 1 },
      { marketHashName: mp7Name, count: 2 },
    ];
    result = await getClientNotSpecialItems(thirdNeed, clientInventory, clientId, partnerId);

    expectedResult = ["1", "3", "6"];
    assetsResult = [];
    result.forEach((r) => {
      assetsResult.push(...r.items.map((i) => i.assetId));
    });
    expect(assetsResult).deep.eq(expectedResult);
    //await wait(1000);
    // checking if function is deleting correctly the items from the database.
    result = await getClientNotSpecialItems(thirdNeed, clientInventory, clientId, partnerId);
    let doc = await db.findOne({ clientId, marketHashName: awpName });
    if (!doc) {
      throw new Error("Doc not found");
    }

    expectedResult = ["1", "2"];
    expect(doc.items.map((i) => i.assetId)).deep.eq(expectedResult);

    // reverting last trade
    result = await getClientNotSpecialItems(thirdNeed, clientInventory, clientId, partnerId);
    await revertNotSpecialItemsDbOperation(result, clientId);
    doc = await db.findOne({ clientId, marketHashName: awpName });
    if (!doc) {
      throw new Error("Doc not found");
    }
    expectedResult = ["2", "1"];
    expect(doc.items.map((i) => i.assetId)).deep.eq(expectedResult);
  });
});

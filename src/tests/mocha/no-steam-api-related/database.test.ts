// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mocha, { expect } from "chai";
import { MongoClient, Db } from "mongodb";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import SteamClientModel from "../../../models/models/steam/steam-profiles/SteamClientModel";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import { ECurrency } from "../../../models/enums/ECurrency";
import SteamClientDbService from "../../../data/services/SteamClientDbService";
import { EFriendRelationship } from "../../../models/enums/EFriendRelationship";
import ItemSellInformationModel from "../../../models/models/steam/steam-market/ItemSellInformationModel";

describe("Basic operations with steamClientModel", () => {
  let db: Db;
  before(function () {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    return new Promise((resolve) => {
      MongoClient.connect("mongodb://localhost:27017/", options).then(async (mongoClient) => {
        db = mongoClient.db("programataTest");
        await db.dropCollection(EMongoDbCollectionNames[EMongoDbCollectionNames.SteamClients]).catch(() => console.log("cannot drop collection"));
        await db
          .dropCollection(EMongoDbCollectionNames[EMongoDbCollectionNames.ItemsSellInformation])
          .catch(() => console.log("cannot drop collection"));
        DbServiceBase.db = db;
        resolve();
      });
    });
  });

  it("Adding and editing entity.", async () => {
    const service = new SteamClientDbService();

    const clientId = "76561198078708271";
    const memberSince = new Date();

    const steamClient: SteamClientModel = {
      memberSince: memberSince,
      isAllowedToAddFriends: true,
      isAllowedToRun: true,
      isAllowedToScan: true,
      hasScamAlert: false,
      nickname: "Test",
      _id: clientId,
      tier: 1,
      friends: {},
      level: 15,
      walletCurrency: ECurrency.eur,
      publicIp: "192.01.01.01",
      walletBalance: 100,
    };
    steamClient._id;
    await service.insertOne(steamClient);

    await service.updateFriend(clientId, "76561198078708272", EFriendRelationship.Friend);
    await service.updateFriend(clientId, "76561198078708273", EFriendRelationship.Blocked);

    await service.updateOne(clientId, { $set: { level: 20 } });

    const expectedSteamClient: SteamClientModel = {
      memberSince: memberSince,
      isAllowedToAddFriends: true,
      isAllowedToRun: true,
      isAllowedToScan: true,
      hasScamAlert: false,
      nickname: "Test",
      _id: clientId,
      tier: 1,
      friends: {
        "76561198078708272": EFriendRelationship.Friend,
        "76561198078708273": EFriendRelationship.Blocked,
      },
      level: 20,
      walletCurrency: ECurrency.eur,
      publicIp: "192.01.01.01",
      walletBalance: 100,
    };

    const doc = await service.findOne(clientId);

    if (!doc) {
      throw new Error("Entity not found");
    }

    expect(doc).to.deep.eq(expectedSteamClient);
  });
  it("Projection only average price", async () => {
    const service = new DbServiceBase<ItemSellInformationModel>(EMongoDbCollectionNames.ItemsSellInformation);
    const item: ItemSellInformationModel = {
      _id: "AWP | Safari Mesh (Field-Tested)",
      averagePrice: 1,
      volume: 1,
      lowestPrice: 1,
      sellPrice: 0,
      droppable: true,
    };
    const { insertedId } = await service.insertOne(item);

    const projection = await service.findOne(insertedId, { averagePrice: 1 });

    if (!projection) {
      throw new Error("entity not found");
    }

    expect(projection.averagePrice).eq(1);
    expect(projection.lowestPrice).eq(undefined);
  });
});

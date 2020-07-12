import DbServiceBase from "./Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../EMongoDbCollectionNames";

import { EFriendRelationship } from "../../models/enums/EFriendRelationship";
import { UpdateWriteOpResult } from "mongodb";
import FriendListModel from "../../models/models/steam/steam-profiles/FriendListModel";
import RecordFunctions from "../../classes/RecordFunctions";
import SteamClientModel from "../../models/models/steam/steam-profiles/SteamClientModel";
import { SteamId64 } from "../../models/types/SteamId64";

export default class SteamClientDbService extends DbServiceBase<SteamClientModel> {
  constructor() {
    super(EMongoDbCollectionNames.SteamClients);
  }

  /**
   * Adding or updating a friend to the database.
   * @param {SteamId64} clientId
   * @param {SteamId64} partnerId
   * @param {EFriendRelationship} relationship
   * @returns {Promise<UpdateWriteOpResult>}
   * @memberof SteamClientDbService
   */
  async updateFriend(clientId: SteamId64, partnerId: SteamId64, relationship: EFriendRelationship): Promise<UpdateWriteOpResult> {
    const element = "friends." + partnerId;
    return await this.updateOne(clientId, { $set: { [element]: relationship } });
  }

  async updateFriendList(clientId: SteamId64, friends: FriendListModel) {
    const { friends: _friends } = (await this.findOne({ _id: clientId }, { friends: 1 })) ?? {};

    // preserving cached friends for adding, because steam doesn't emit them.
    const filteredFriendList = RecordFunctions.filter(_friends ?? {}, (v) => {
      return v === EFriendRelationship.CachedForAdding;
    });
    Object.assign(filteredFriendList, friends);
    await this.updateOne(clientId, { $set: { friends: filteredFriendList } });
    return filteredFriendList;
  }
  /**
   * Removing a friend from the database.
   * @param {SteamId64} clientId
   * @param {SteamId64} partnerId
   * @returns {Promise<UpdateWriteOpResult>}
   * @memberof SteamClientDbService
   */
  async removeFriend(clientId: SteamId64, partnerId: SteamId64): Promise<UpdateWriteOpResult> {
    const element = "friends." + partnerId;
    return await this.updateOne(clientId, { $unset: { [element]: "" } });
  }
}

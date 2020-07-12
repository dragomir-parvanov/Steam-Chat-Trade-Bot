import SteamUser from "steam-user";
import { SteamId64 } from "../../../models/types/SteamId64";
import tryy from "../../tryy/tryy";
import ADDING_FRIEND_MAX_RETRIES from "../../../shared-network/constants/steam/max-retries/ADDING_FRIEND_MAX_RETRIES";
import ADDING_FRIEND_WAIT_ON_FAIL from "../../../shared-network/constants/steam/wait-before-retry/ADDING_FRIEND_WAIT_ON_FAIL";
import SteamClientDbService from "../../../data/services/SteamClientDbService";
import { EFriendRelationship } from "../../../models/enums/EFriendRelationship";
import log from "../../../classes/logger/Log";
import g_removedFriendsNoReAdd from "../../../steam-client/globals/g_removedFriendsNoReAdd";
import main_handleFriendRelationshipChange from "../../../main-server/src/functions/childs/router-related/main_handleFriendRelationshipChange";
import g_steamInstancesStores from "../../../steam-client/globals/g_steamInstancesStores";
import LogError from "../../../classes/errors/base/LogError";

const db = new SteamClientDbService();

export default class SteamUserFunctions {
  constructor(public clientId: SteamId64) {
    const store = g_steamInstancesStores[clientId];
    if (!store) {
      throw new LogError(`Store for client id ${clientId} is not found`);
    }
    this.client = store.client;
  }
  private client: SteamUser;
  /**
   *Returns true if the friend is added,
   *return false if if the friend is cached for adding
   * @static
   * @memberof SteamUserFunctions
   */
  addFriend = (partnerId: SteamId64): Promise<boolean> => {
    const { clientId, client } = this;
    return new Promise<boolean>((resolve) => {
      tryy({ maxRetries: ADDING_FRIEND_MAX_RETRIES, waitOnFail: ADDING_FRIEND_WAIT_ON_FAIL }, ({ cancel }) => {
        client.addFriend(partnerId, async (error, status) => {
          if (error) {
            await db.updateFriend(clientId, partnerId, EFriendRelationship.CachedForAdding);
            main_handleFriendRelationshipChange(clientId, partnerId, EFriendRelationship.CachedForAdding);
            cancel("some error met");
            resolve(false);
            return;
          }
          main_handleFriendRelationshipChange(clientId, partnerId, EFriendRelationship.RequestInitiator);
          await db
            .updateFriend(clientId, partnerId, EFriendRelationship.RequestInitiator)
            .then(() => resolve(true))
            .catch((error) => {
              log.error(error);
              cancel("Friend is added, but cannot update it to the database");
              resolve(false);
            });
        });
      }).catch(() => resolve(false));
    });
  };

  sendMessage = (message: string, partnerId: SteamId64): void => {
    this.client.chatMessage(partnerId, message);
  };

  removeFriend = async (partnerId: string, shouldNotReAddAsFriend?: boolean): Promise<void> => {
    if (shouldNotReAddAsFriend) {
      g_removedFriendsNoReAdd.add(partnerId);
    }
    this.client.removeFriend(partnerId);
  };

  getSteamUser(partnerId: SteamId64) {
    return this.client.users[partnerId];
  }
}

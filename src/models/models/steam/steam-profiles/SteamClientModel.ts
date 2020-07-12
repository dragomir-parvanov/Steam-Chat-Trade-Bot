import FriendListModel from "./FriendListModel";
import { ECurrency } from "../../../enums/ECurrency";
import { SteamId64 } from "../../../types/SteamId64";
import Identifiable from "../../../../data/identifiables/Identifiable";

/**
 * Database steam client model.
 * @export
 * @interface SteamClientModel
 * @extends {SteamId64Identifiable}
 */
export default interface SteamClientModel extends NonNullable<Identifiable<SteamId64>> {
  _id: SteamId64;

  /**
   * The public steam name of the steam account.
   * @type {string}
   * @memberof SteamClientModel
   */
  nickname: string;

  /**
   * The more expensive items the account have, the higher the tier should be.
   * Steam level should be considered too.
   * @type {number}
   * @memberof SteamClientModel
   */
  tier: number;

  /**
   * When the steam client was registered on the steam network.
   * @type {Date}
   * @memberof SteamClientModel
   */
  memberSince: Date;

  /**
   * Current friends.
   * Current friend requests that we have sent or received.
   * Current blocked partners and etc.
   * @type {FriendListModel}
   * @memberof SteamClientModel
   */
  friends: FriendListModel;

  /**
   * The steam level from the steam trading cards.
   * @type {number}
   * @memberof SteamClientModel
   */
  level: number;

  /**
   * Which wallet currency the steam client have.
   * @type {ECurrency}
   * @memberof SteamClientModel
   */
  walletCurrency: ECurrency;

  /**
   * How much money does the account have
   */
  walletBalance: number;

  /**
   * If the steam client is allowed to scan his friend list for potentional active chats.
   * @type {boolean}
   * @memberof SteamClientModel
   */
  isAllowedToScan: boolean;

  /**
   * If the steam client is allowed to add friends.
   * @type {boolean}
   * @memberof SteamClientModel
   */
  isAllowedToAddFriends: boolean;

  /**
   * If the steam client is allowed to be running.
   * @type {boolean}
   * @memberof SteamClientModel
   */
  isAllowedToRun: boolean;

  /**
   * The public ip that the client uses for connecting to the steam network.
   * @type {string}
   * @memberof SteamClientModel
   */
  publicIp: string;

  /**
   * If the steam client is being flagged by steam for a potentional scammer.
   * @type {boolean}
   * @memberof SteamClientModel
   */
  hasScamAlert: boolean;
}

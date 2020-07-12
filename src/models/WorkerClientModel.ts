import SteamClientModel from "./models/steam/steam-profiles/SteamClientModel";

/**
 * Worker process
 * @export
 * @interface WorkerClientModel
 * @extends {SteamClientModel}
 */
export default interface WorkerClientModel extends Omit<SteamClientModel, "friends"> {
  friendListCount: number;
  maxFriendListCount: number;
  isRunning: boolean;
  hasCrashed: boolean;

  // not implemented
  /**
   * The name of the cluster that holds this steam client.
   * @type {string}
   * @memberof SteamClientModel
   */
  cluster?: string;
}

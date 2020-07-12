import SteamCommunity from "steamcommunity";
import { promisify } from "util";
import { PromisifiedSteamCommunity } from "../../models/types/PromisifiedCommunity";

/**
 * Creates promisified version of steam community.
 * Callbacks are transformed to promisess
 */
export default function promisifySteamCommunity(community: SteamCommunity): PromisifiedSteamCommunity {
  const getSteamUser = promisify(community.getSteamUser.bind(community));
  const getUserInventoryContents = promisify(community.getUserInventoryContents.bind(community));
  const acceptAllConfirmations = promisify(community.acceptAllConfirmations.bind(community));
  const httpRequestGet = promisify(community.httpRequestGet.bind(community));
  const httpRequestPost = promisify(community.httpRequestPost.bind(community));

  community.getSteamUser = getSteamUser;
  community.getUserInventoryContents = getUserInventoryContents;
  community.acceptAllConfirmations = acceptAllConfirmations;
  community.httpRequestGet = httpRequestGet;
  community.httpRequestPost = httpRequestPost;

  return community as PromisifiedSteamCommunity;
}

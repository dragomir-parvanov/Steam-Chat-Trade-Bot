import { PromisifiedSteamUser } from "../../../models/types/PromisifiedSteamUser";
import log from "../../../classes/logger/Log";
import { EFriendRelationship } from "../../../models/enums/EFriendRelationship";
import { PromisifiedSteamCommunity } from "../../../models/types/PromisifiedCommunity";
import TradeOfferManager from "steam-tradeoffer-manager";
import SteamClientDbService from "../../../data/services/SteamClientDbService";
import g_currentlyScannedProfiles from "../../globals/g_currentlyScannedProfiles";
import scanProfile from "../scanning/scanProfile";
import isProfileEligibleForScanning from "../scanning/isProfileEligibleForScanning";
import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import ESteamChatMessageType from "../../../models/enums/ESteamChatMessageType";
import getActiveChat from "../chats/getActiveChat";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import g_activeChats from "../../../shared-network/globals/observables/chat-related/g_activeChats";
import createDoubleIdentification from "../../../functions/doubleIdentification";
import g_removedFriendsNoReAdd from "../../globals/g_removedFriendsNoReAdd";
import ToBeAddedProfilesDbService from "../../../data/services/ToBeAddedProfilesDbService";
import { SteamId64 } from "../../../models/types/SteamId64";
import handleNewSteamUserStatus from "../../../main-server/src/functions/childs/router-related/handleNewSteamUserStatus";
import o_newMessages from "../../../shared-network/globals/observables/chat-related/o_newMessages";
import o_newChats from "../../../shared-network/globals/observables/chat-related/o_newChats";
import main_handleFriendRelationshipChange from "../../../main-server/src/functions/childs/router-related/main_handleFriendRelationshipChange";
import SteamClientModel from "../../../models/models/steam/steam-profiles/SteamClientModel";
import { parseMarketPrice } from "../../../factories/ItemSellInformationParsedSteamAPIModel";
import ECurrencyCode from "../../../declarations/steam-user/EcurrencyCode";
import { ECurrency } from "../../../models/enums/ECurrency";
import LogError from "../../../classes/errors/base/LogError";
import g_clientWorkersInformation from "../../../main-server/src/globals/g_clientWorkersInformation";
import initializeWalletChangeHandler from "./initializeWalletChangeHandler";

export default function initializeSteamUserEventHandler(
  clientId: SteamId64,
  client: PromisifiedSteamUser,
  community: PromisifiedSteamCommunity,
  manager: TradeOfferManager
): void {
  initializeWalletChangeHandler(clientId, client, community);
  client.on("user", async (steamID, user) => {
    const partnerId = steamID.getSteamID64();
    handleNewSteamUserStatus(clientId, partnerId, user);
    // if the persona state is different from the previous one
    // because user event is emited very frequently, but the persona state is not always changed.
    if (user.persona_state && user.persona_state !== client.users[partnerId].persona_state) {
      const eligible = await isProfileEligibleForScanning(clientId, partnerId, client);
      if (eligible) {
        g_currentlyScannedProfiles.add(partnerId);
        await scanProfile(clientId, partnerId);
      }
    }
  });

  client.on("friendMessage", async (steamID, message: string) => {
    const partnerId = steamID.getSteamID64();
    const id = createDoubleIdentification(clientId, partnerId);
    log.do(`Friend message from ${partnerId}, message:${message}`);
    const db = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);
    const dbMessage: SteamChatMessageModel = {
      clientId,
      partnerId,
      addedOn: new Date(),
      type: ESteamChatMessageType.PartnerMessage,
      value: message,
    };
    const r = await db.insertOne(dbMessage);
    dbMessage._id = r.insertedId;

    g_currentlyScannedProfiles.add(partnerId);

    try {
      if (g_activeChats[id]) {
        o_newMessages.next(dbMessage);
      } else {
        const chat = await getActiveChat(clientId, partnerId);
        o_newChats.next(chat);
        o_newMessages.next(dbMessage);
      }
    } finally {
      g_currentlyScannedProfiles.delete(partnerId);
    }
  });

  client.on("friendRelationship", async (profile, relationship) => {
    const partnerId = profile.getSteamID64();
    log.do(`Friend relationship with ${partnerId} changed to ${EFriendRelationship[relationship]}`);

    main_handleFriendRelationshipChange(clientId, partnerId, relationship);
  });
  client.on("friendRelationship", async (profile, relationship) => {
    const partnerId = profile.getSteamID64();
    const db = new SteamClientDbService();
    const toBeAddedProfilesService = new ToBeAddedProfilesDbService();
    if (relationship === EFriendRelationship.None) {
      await db.removeFriend(clientId, partnerId);
      const cachedProfile = g_removedFriendsNoReAdd[partnerId];
      if (!cachedProfile) {
        await toBeAddedProfilesService.addProfile(clientId, partnerId);
      }
    } else {
      await db.updateFriend(clientId, partnerId, relationship);
      if (relationship === EFriendRelationship.Friend) {
        await scanProfile(clientId, partnerId);
      }
    }
  });
}

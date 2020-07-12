import DbServiceBase from "../../../../../data/services/Base/DbServiceBase";
import SteamChatMessageModel from "../../../../../models/models/chats/SteamChatMessageModel";
import { EMongoDbCollectionNames } from "../../../../../data/EMongoDbCollectionNames";
import { EFriendRelationship } from "../../../../../models/enums/EFriendRelationship";
import g_clientWorkersInformation from "../../../globals/g_clientWorkersInformation";
import ESteamChatMessageType from "../../../../../models/enums/ESteamChatMessageType";
import createDoubleIdentification from "../../../../../functions/doubleIdentification";
import g_activeChats from "../../../../../shared-network/globals/observables/chat-related/g_activeChats";
import o_newMessages from "../../../../../shared-network/globals/observables/chat-related/o_newMessages";
import { SteamId64 } from "../../../../../models/types/SteamId64";

export default function main_handleFriendRelationshipChange(clientId: SteamId64, partnerId: SteamId64, relationship: EFriendRelationship) {
  const db = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);
  if (relationship === EFriendRelationship.None) {
    // possible problem, it might emit before the client is created and set
    g_clientWorkersInformation[clientId].friendListCount--;
    const message: SteamChatMessageModel = {
      clientId,
      partnerId,
      addedOn: new Date(),
      type: ESteamChatMessageType.SystemMessage,
      value: "Partner is no longer friend with us",
    };
    db.insertOne(message).then((r) => {
      const id = createDoubleIdentification(clientId, partnerId);
      if (!g_activeChats[id]) {
        return;
      }
      message._id = r.insertedId;
      o_newMessages.next(message);
    });
  }
  // we already have incremented the value when adding the friend
}

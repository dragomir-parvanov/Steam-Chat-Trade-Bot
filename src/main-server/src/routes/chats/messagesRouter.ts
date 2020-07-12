import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import SteamChatMessageModel from "../../../../models/models/chats/SteamChatMessageModel";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";
import g_activeChats from "../../../../shared-network/globals/observables/chat-related/g_activeChats";
import o_newMessages from "../../../../shared-network/globals/observables/chat-related/o_newMessages";
import ESteamChatMessageType from "../../../../models/enums/ESteamChatMessageType";
import { SteamId64 } from "../../../../models/types/SteamId64";
import LogError from "../../../../classes/errors/base/LogError";
import g_clientWorkersImplementation from "../../globals/g_clientWorkersImplementation";

export async function fr_sendMessage(clientId: SteamId64, partnerId: SteamId64, value: string) {
  const db = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);
  const message: SteamChatMessageModel = {
    clientId,
    partnerId,
    addedOn: new Date(),
    type: ESteamChatMessageType.ClientMessage,
    value,
  };
  const worker = g_clientWorkersImplementation[clientId];

  if (!worker) {
    throw new LogError(`Worker with id ${clientId} doesn't exist`);
  }
  worker.functions.sendMessage(value, partnerId);
  o_newMessages.next(message);
  await db.insertOne(message);
}

export async function fr_getSpecificMessages(clientId: SteamId64, partnerId: SteamId64, beforeTime: number) {
  const db = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);

  const before = new Date(beforeTime);

  const cursor = db.findMany({ addedOn: { $lte: before }, clientId: clientId, partnerId: partnerId });
  const result = await cursor.toArray();
  return result;
}

export async function fr_getAllMessages(beforeTime?: number) {
  const db = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);

  let chats = Object.values(g_activeChats);
  if (beforeTime) {
    const before = new Date(beforeTime);
    chats = chats.filter((c) => c.addedOn < before);
  }
  const clientIds = chats.map((c) => c.clientId);

  const partnerIds = chats.map((c) => c.partnerId);

  let cursor = db.findMany({ clientId: { $in: clientIds }, partnerId: { $in: partnerIds } });

  const messages = await cursor.toArray();
  return messages;
}

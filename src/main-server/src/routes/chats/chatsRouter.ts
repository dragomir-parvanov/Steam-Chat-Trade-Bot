import { Router, Request } from "express";
import g_activeChats from "../../../../shared-network/globals/observables/chat-related/g_activeChats";
import SendTradeOfferModel from "../../../../models/models/steam/steam-offers/SendTradeOfferModel";
import createDoubleIdentification from "../../../../functions/doubleIdentification";
import CriticalLogError from "../../../../classes/errors/base/CriticalLogError";
import LogError from "../../../../classes/errors/base/LogError";
import PartnerScanningDbService from "../../../../data/services/PartnerScanningDbService";
import o_chatUpdate from "../../../../shared-network/globals/observables/chat-related/o_chatUpdate";
import { SteamId64 } from "../../../../models/types/SteamId64";
import g_clientWorkersImplementation from "../../globals/g_clientWorkersImplementation";
import g_clientsInventories from "../../../../shared-network/globals/observables/chat-related/g_clientsInventories";

export function fr_getAllActiveChats() {
  const chats = Object.values(g_activeChats);
  return chats;
}

// Todo add some checks to prevent dumping all items to some partner
export async function fr_sendOfferInChat(this: Request, request: SendTradeOfferModel) {
  const madeByWorker = this?.user?.["_id"];

  if (!madeByWorker) {
    throw new LogError("Made by worker is undefined");
  }
  const editedRequest: SendTradeOfferModel = { ...request };

  const id = createDoubleIdentification(request.clientId, request.partnerId);

  if (!g_activeChats[id]) {
    throw new CriticalLogError(`Someone tried to send an offer to chat with id ${id}, but that chat wasn't active`);
  }
  await g_clientWorkersImplementation[request.clientId].functions.sendTradeOffer(
    editedRequest,
    g_clientsInventories[request.clientId],
    g_activeChats[id].partnerInventory.items,
    madeByWorker
  );
}

export async function fr_rescanAfterDays(clientId: SteamId64, partnerId: SteamId64, rescanAfterDays: number) {
  const db = new PartnerScanningDbService();

  const id = createDoubleIdentification(clientId, partnerId);
  const chat = g_activeChats[id];
  if (!chat) {
    throw new LogError(`No chat to be rescanned after days with id ${id}`);
  }
  o_chatUpdate.next({ clientId, partnerId, isActive: false });
  await db.rescanAfterDays(partnerId, rescanAfterDays);
}

export function fr_removeFriend(clientId: SteamId64, partnerId: SteamId64) {
  const id = createDoubleIdentification(clientId, partnerId);
  const chat = g_activeChats[id];

  if (!chat) {
    throw new LogError(`No chat to be removed as friend after days with id ${id}`);
  }

  o_chatUpdate.next({ clientId, partnerId, isActive: false });
  const clientWorker = g_clientWorkersImplementation[clientId];

  if (!clientWorker) {
    throw new LogError(`No client found with id ${clientId}`);
  }

  clientWorker.functions.removeFriend(partnerId);
}

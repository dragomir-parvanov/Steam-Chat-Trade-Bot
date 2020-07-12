import { SteamId64 } from "../../../../../models/types/SteamId64";
import TradeOfferModel from "../../../../../models/models/steam/steam-offers/TradeOfferModel";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import DbServiceBase from "../../../../../data/services/Base/DbServiceBase";
import SteamChatMessageModel from "../../../../../models/models/chats/SteamChatMessageModel";
import { EMongoDbCollectionNames } from "../../../../../data/EMongoDbCollectionNames";
import o_newMessages from "../../../../../shared-network/globals/observables/chat-related/o_newMessages";

export default async function main_handleSteamOfferChanged(
  clientId: SteamId64,
  partnerId: SteamId64,
  offerId: TradeOfferModel["_id"],
  state: ETradeOfferState
) {
  const db = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);

  const message: SteamChatMessageModel = {
    clientId,
    partnerId,
    type: state as never,
    value: offerId,
    addedOn: new Date(),
  };
  await db.insertOne(message);

  o_newMessages.next(message);
}

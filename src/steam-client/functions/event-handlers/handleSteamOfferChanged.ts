import { TradeOffer } from "../../../declarations/steam-tradeoffer-manager/TradeOffer";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import TradeOfferModel from "../../../models/models/steam/steam-offers/TradeOfferModel";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import createParsedItem from "../../../factories/createParsedItem";
import createParsedItemInventoryWithSellInformationModel from "../../../factories/mongo/createParsedItemWithSellInformationModel";
import applySteamMarketFees from "../../../business-logic/steam/calculateMarketplaceSellFee";
import tryy from "../../../functions/tryy/tryy";
import calculateTradeOfferProfit from "../../../business-logic/functions/calculateTradeOfferProfit";
import log from "../../../classes/logger/Log";
import { SteamId64 } from "../../../models/types/SteamId64";
import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import o_newMessages from "../../../shared-network/globals/observables/chat-related/o_newMessages";

export default async function handleSteamOfferChanged(offer: TradeOffer, clientId: SteamId64) {
  const partnerId = offer.partner.getSteamID64();
  const service = new DbServiceBase<TradeOfferModel>(EMongoDbCollectionNames.TradeOffers);
  const partnerParsedItems = offer.itemsToReceive.map(createParsedItem);
  const clientParsedItems = offer.itemsToGive.map(createParsedItem);

  // PROBLEM: When trade offer is emitted, it doesn't have any applyings attributes.
  const partnerParsedItemsWithSellInformation = await createParsedItemInventoryWithSellInformationModel(partnerParsedItems);
  const clientParsedItemsWithSellInformation = await createParsedItemInventoryWithSellInformationModel(clientParsedItems);

  await tryy({ maxRetries: 10, waitOnFail: 3000 }, async () => {
    await service
      .updateOne(offer.id, {
        $set: {
          state: offer.state,
          itemsToReceive: partnerParsedItemsWithSellInformation,
          itemsToGive: clientParsedItemsWithSellInformation,
          profit: calculateTradeOfferProfit(clientParsedItemsWithSellInformation, partnerParsedItemsWithSellInformation),
        },
      })
      .catch((error) => {
        log.error(error, "Couldn't update the offer");
      });
  });

  const messageDb = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);

  const message: SteamChatMessageModel = {
    clientId,
    partnerId,
    type: offer.state as never,
    value: offer.id,
    addedOn: new Date(),
  };
  await messageDb.insertOne(message);

  o_newMessages.next(message);
}

import SendTradeOfferModel from "../../../models/models/steam/steam-offers/SendTradeOfferModel";
import AssetId from "../../../models/types/AssetId";
import getClientNotSpecialItems from "./getClientNotSpecialItems";
import LogError from "../../../classes/errors/base/LogError";
import SteamTradeOfferManagerFunctions from "../../../functions/steam/steam-trade-offer-manager/SteamTradeOfferManagerFunctions";
import getPartnerNotSpecialItems from "./getPartnerNotSpecialItems";
import revertNotSpecialItemsDbOperation from "./revertNotSpecialItemsDbOperation";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import ESteamChatMessageType from "../../../models/enums/ESteamChatMessageType";
import SteamCommunityFunctions from "../../../functions/steam/steam-community/SteamCommunityFunctions";
import o_newMessages from "../../../shared-network/globals/observables/chat-related/o_newMessages";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";

export default async function sendOffer(
  sendOfferModel: SendTradeOfferModel,
  clientInventory: ParsedItemModel[],
  partnerInventory: ParsedItemModel[],
  madeByWorker: string,
  isMaintanceOffer?: boolean
): Promise<void> {
  const clientAssetIds: AssetId[] = [];
  const { clientId, partnerId } = sendOfferModel;
  const communityFunctions = new SteamCommunityFunctions(clientId);
  const managerFunctions = new SteamTradeOfferManagerFunctions(clientId);
  const clientNotSpecialItems = await getClientNotSpecialItems(sendOfferModel.client.notSpecialItems, clientInventory, clientId, partnerId);

  clientNotSpecialItems.forEach((i) => {
    clientAssetIds.push(...i.items.map((i) => i.assetId));
  });

  clientAssetIds.push(...sendOfferModel.client.exactItemAssetIds);

  if (clientAssetIds.length !== new Set(clientAssetIds).size) {
    throw new LogError("We have duplicated client assetids in the trade offer");
  }

  const partnerAssetIds: AssetId[] = [];

  partnerAssetIds.push(...getPartnerNotSpecialItems(sendOfferModel.partner.notSpecialItems, partnerInventory, clientId, partnerId));
  partnerAssetIds.push(...sendOfferModel.partner.exactItemAssetIds);

  // either we create the offer by the partner steamId64 or by the steam trade link
  const connect = sendOfferModel.tradeOfferLink ? sendOfferModel.tradeOfferLink : sendOfferModel.partnerId;

  const offer = managerFunctions.createOffer(connect);
  const offerClientItems = clientAssetIds.map((i) => {
    return { amount: 1, appid: 730, contextid: "2", id: i };
  });
  offer.addMyItems(offerClientItems);
  const offerPartnerItems = partnerAssetIds.map((i) => {
    return { amount: 1, appid: 730, contextid: "2", id: i };
  });
  offer.addTheirItems(offerPartnerItems);
  const { offerMessage } = sendOfferModel;
  console.log("calling manager functions");
  await managerFunctions.sendOffer(offer, madeByWorker, communityFunctions, !!isMaintanceOffer, offerMessage).catch(async (error) => {
    console.log("cached error when sending offer. sending an error message to main process");
    const db = new DbServiceBase<SteamChatMessageModel>(EMongoDbCollectionNames.SteamMessages);
    revertNotSpecialItemsDbOperation(clientNotSpecialItems, clientId);
    const message: SteamChatMessageModel = {
      addedOn: new Date(),
      value: `${error}`,
      type: ESteamChatMessageType.Error,
      clientId,
      partnerId,
    };

    await db.insertOne(message);

    o_newMessages.next(message);

    throw new LogError(error);
  });
}

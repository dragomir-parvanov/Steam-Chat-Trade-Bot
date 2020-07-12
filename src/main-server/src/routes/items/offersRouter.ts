import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import TradeOfferModel from "../../../../models/models/steam/steam-offers/TradeOfferModel";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";
import LogError from "../../../../classes/errors/base/LogError";
import { FilterQuery } from "mongoose";
import isUserAdmin from "../../passport/isUserAdmin";
import RegisteredUserModel from "../../../../models/site/RegisteredUserModel";
import TradeOffersQueryRequestModel from "../../../../shared-network/models/web/requests/TradeOffersQueryRequestModel";
import MAX_TRADE_OFFERS_PER_PAGE from "../../../../shared-network/constants/to-main/MAX_TRADE_OFFERS_PER_PAGE";
import TradesSummaryResponseModel, { TradesSummaryValueModel } from "../../../../shared-network/models/web/responses/TradesSummaryResponseModel";
import RecordFunctions from "../../../../classes/RecordFunctions";
import flooring from "../../../../functions/flooring";
import { SteamId64 } from "../../../../models/types/SteamId64";
import SteamCommunityFunctions from "../../../../functions/steam/steam-community/SteamCommunityFunctions";
import extractPartnerSteamId64FromTradeOfferLink from "../../../../functions/steam/extractPartnerSteamId64FromTradeOfferLink";
import createParsedItemInventoryWithSellInformationModel from "../../../../factories/mongo/createParsedItemWithSellInformationModel";
import CreateTradeOfferModel from "../../../../models/models/steam/steam-offers/CreateTradeOfferModel";
import g_clientsInventories from "../../../../shared-network/globals/observables/chat-related/g_clientsInventories";
import g_partnerInventories from "../../../../steam-client/globals/g_partnerInventories";
import SendTradeOfferModel from "../../../../models/models/steam/steam-offers/SendTradeOfferModel";
import sendOffer from "../../../../steam-client/functions/offers/sendOffer";
import { Request } from "express";

export async function fr_getOffer(offerId: string) {
  const db = new DbServiceBase<TradeOfferModel>(EMongoDbCollectionNames.TradeOffers);

  const offer = await db.findOne({ _id: offerId });
  if (!offer) {
    throw new Error(`Offer with id ${offerId} is not found`);
  }
  return offer;
}

export async function fr_getOffersByIds(offerIds: string[]) {
  const db = new DbServiceBase<TradeOfferModel>(EMongoDbCollectionNames.TradeOffers);
  const offers = await db.findMany({ _id: { $in: offerIds } }).toArray();
  return offers;
}

// code inject is 100% possible here
export async function fr_getOffersWithQuery(this: Express.Request | any, query: TradeOffersQueryRequestModel) {
  const user = this.user as RegisteredUserModel;
  console.log("query", query);
  if (!user) {
    throw new LogError("User is not in the request");
  }
  if (query.count > MAX_TRADE_OFFERS_PER_PAGE) {
    query.count = MAX_TRADE_OFFERS_PER_PAGE;
  }
  if (!isUserAdmin(user as any)) {
    query.mongoQuery.madeByWorker = user._id;
  }

  const db = new DbServiceBase<TradeOfferModel>(EMongoDbCollectionNames.TradeOffers);
  const cursor = db.findMany({
    ...query.mongoQuery,
    $and: [{ actedOn: { $gte: new Date(query.afterDate) } }, { actedOn: { $lte: new Date(query.beforeDate) } }],
  });
  const total = await cursor.count();

  const value = await cursor
    .skip((query.page - 1) * query.count)
    .sort(query.sortQuery)
    .limit(query.count)
    .toArray();

  return { total, value };
}

export async function fr_offersSummary(
  this: any,
  afterTime: number,
  beforeTime: number,
  specificWorkers?: string[]
): Promise<TradesSummaryResponseModel> {
  const { user } = this as { user: RegisteredUserModel };
  if (!user) {
    throw new Error("User is not in the offers summary");
  }
  const workerQuery: FilterQuery<TradeOfferModel> = { madeByWorker: user._id };
  if (specificWorkers) {
    if (isUserAdmin(user)) {
      workerQuery.madeByWorker = { $in: specificWorkers };
    }
  }
  const db = new DbServiceBase<TradeOfferModel>(EMongoDbCollectionNames.TradeOffers);
  const match: typeof db.query = {
    madeByWorker: workerQuery.madeByWorker,
    $and: [{ actedOn: { $gte: new Date(afterTime) } }, { actedOn: { $lte: new Date(beforeTime) } }],
  };
  const group = { _id: "$state", sum: { $sum: "$profit" }, count: { $sum: 1 } };

  const aggregateCursor = db.aggregate([{ $match: match }, { $group: group }]);
  const aggregateResult = await aggregateCursor.toArray();
  const record = RecordFunctions.convertToRecord<TradesSummaryValueModel>(aggregateResult as never, "_id");
  RecordFunctions.forEach(record, (v) => (v.sum = flooring(v.sum)));

  return record as any;
}

export async function fr_getTradeOfferDetailsFromTradeLink(clientId: SteamId64, tradeOfferLink: string): Promise<CreateTradeOfferModel> {
  const communityFunctions = new SteamCommunityFunctions(clientId);

  const partnerId = extractPartnerSteamId64FromTradeOfferLink(tradeOfferLink);

  const clientInventory = g_clientsInventories[clientId];

  const partnerInventory = await communityFunctions.getInventory(partnerId, 730, 2, false, 5);
  g_partnerInventories[partnerId] = partnerInventory.items;
  const clientItemsWithSellInformation = await createParsedItemInventoryWithSellInformationModel(clientInventory);

  const partnerItemsWithSellInformation = await createParsedItemInventoryWithSellInformationModel(partnerInventory.items);

  return { clientItems: clientItemsWithSellInformation, partnerItems: partnerItemsWithSellInformation, clientId, partnerId };
}

export async function fr_sendTradeOfferFromTradeLink(this: Request, request: SendTradeOfferModel) {
  const madeByWorker = this.user?.["_id"] as any;

  if (!madeByWorker) {
    throw new LogError("Made by worker is undefined");
  }

  const clientInventory = g_clientsInventories[request.clientId];
  if (!clientInventory) {
    throw new LogError(`Client inventory for ${request.clientId} is not found`);
  }
  const partnerInventory = g_partnerInventories[request.partnerId];

  if (!partnerInventory) {
    throw new LogError(`Partner inventory for ${request.partnerId} is not found`);
  }

  await sendOffer(request, clientInventory, partnerInventory, madeByWorker, true);
}

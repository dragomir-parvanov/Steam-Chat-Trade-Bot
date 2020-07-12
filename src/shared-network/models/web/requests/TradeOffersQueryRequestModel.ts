import TradeOfferModel from "../../../../models/models/steam/steam-offers/TradeOfferModel";
import { FilterQuery } from "mongoose";
import SortQueryType from "../../../../data/models/SortQueryType";

export default interface TradeOffersQueryRequestModel {
  beforeDate: number;
  afterDate: number;
  mongoQuery: FilterQuery<TradeOfferModel>;
  page: number;
  count: number;
  sortQuery: SortQueryType<TradeOfferModel>;
}

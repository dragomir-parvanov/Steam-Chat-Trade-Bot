import { ECurrency } from "../../../enums/ECurrency";

export interface MarketSellListingModel {
  marketHashName: string;
  price: number;
  amount: number;
}

type MarketSellListingsModel = {
  [i in keyof typeof ECurrency]: MarketSellListingModel[];
};

export default MarketSellListingsModel;

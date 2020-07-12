import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import applySteamMarketFees from "../steam/calculateMarketplaceSellFee";
import flooring from "../../functions/flooring";
import calculateClientItemsSum from "./calculateClientItemsSum";
import calculatePartnerItemsSum from "./calculatePartnerItemsSum";

export default function calculateTradeOfferProfit(clientItems: ParsedItemWithSellInformationModel[], partnerItems: ParsedItemWithSellInformationModel[]): number {
  const clientPrice = calculateClientItemsSum(clientItems);
  const partnerPrice = calculatePartnerItemsSum(partnerItems);

  return flooring(partnerPrice - clientPrice);
}

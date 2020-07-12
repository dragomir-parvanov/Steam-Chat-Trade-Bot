import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import applySteamMarketFees from "../steam/calculateMarketplaceSellFee";
import flooring from "../../functions/flooring";

export default function calculatePartnerItemsSum(items: ParsedItemWithSellInformationModel[]) {
  const sum = items.reduce<number>((acc, i) => {
    return acc + applySteamMarketFees(i.lowestPrice);
  }, 0);

  return flooring(sum);
}

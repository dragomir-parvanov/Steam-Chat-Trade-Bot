import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import flooring from "../../functions/flooring";

export default function calculateClientItemsSum(items: ParsedItemWithSellInformationModel[]): number {
  const sum = items.reduce<number>((acc, i) => {
    return acc + i.averagePrice + i.applyingsPrice;
  }, 0);
  return flooring(sum);
}

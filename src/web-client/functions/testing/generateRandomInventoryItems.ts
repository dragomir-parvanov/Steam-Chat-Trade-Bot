import ParsedItemWithSellInformationModel from "../../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import generateRandomItemWithSellInformation from "./generateRandomItemWithSellInformation";
import generateGUID from "../../../functions/generateGUID";

export default function generateRandomInventoryItems(amount: number, uniqueness: number): ParsedItemWithSellInformationModel[] {
  const uniqueItems = Math.floor(amount / uniqueness);
  const items: ParsedItemWithSellInformationModel[] = [];
  let shouldBreak = false;
  for (let i = 0, iteration = 0; i < uniqueItems; i++) {
    const marketHashName = generateGUID();
    for (let n = 0; n < uniqueness; n++, iteration++) {
      items.push(generateRandomItemWithSellInformation(marketHashName));
      if (iteration === amount) {
        shouldBreak = true;
        break;
      }
    }
    if (shouldBreak) {
      break;
    }
  }
  return items;
}

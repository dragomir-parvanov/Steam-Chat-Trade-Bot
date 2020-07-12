import ItemSellInformationModel from "../../../../models/models/steam/steam-market/ItemSellInformationModel";

export default async function sortItemsByPrice(
  calculatePriceBy: keyof Pick<ItemSellInformationModel, "averagePrice" | "lowestPrice" | "sellPrice">,
  ...items: ItemSellInformationModel[][]
) {
  items.forEach((i) => {
    i = i.sort((a, b) => b[calculatePriceBy] - a[calculatePriceBy]);
  });
}

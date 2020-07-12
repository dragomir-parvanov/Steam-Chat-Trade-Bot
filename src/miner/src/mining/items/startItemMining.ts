import getItemsToMine from "../../networking/get/getItemsToMine";

import getItemWithPrice from "./getItemWithPrice";

import sendMinedItems from "../../networking/post/sendMinedItems";
import wait from "../../../../functions/wait";
import ItemSellInformationParsedSteamAPIModel from "../../../../models/models/steam/steam-items/ItemSellInformationParsedSteamAPIModel";

export default async function startItemMining(): Promise<void> {
  while (true) {
    const itemsToMine = await getItemsToMine();
    const minedItems: ItemSellInformationParsedSteamAPIModel[] = [];
    for (const item of itemsToMine) {
      await getItemWithPrice(item)
        .then((i) => minedItems.push(i))
        .catch((error) => {
          console.log(`Not sending mined item with market hash name- ${item}. Error:\n${error.message}`);
        });
      await wait(3000);
    }

    if (minedItems.length > 0) {
      await sendMinedItems(minedItems);
    } else {
      console.log("Not sending any items");
      console.log("Items that had to mine:\n" + itemsToMine);
    }
  }
}

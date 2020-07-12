import { SteamId64 } from "../../../models/types/SteamId64";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import MarketSellOrderModel from "../../../models/models/steam/steam-market/MarketSellOrderModel";
import SteamCommunityFunctions from "../../../functions/steam/steam-community/SteamCommunityFunctions";
import { ECurrency } from "../../../models/enums/ECurrency";
import sellItemOnMarket from "./sellItemOnMarket";
import wait from "../../../functions/wait";
import log from "../../../classes/logger/Log";
import AssetId from "../../../models/types/AssetId";
import o_newClientInventory from "../../../shared-network/globals/observables/chat-related/o_newClientInventory";

export default async function (
  clientId: SteamId64,
  inventory: ParsedItemModel[],
  sellOrders: Record<string, MarketSellOrderModel>,
  currency: ECurrency
) {
  const communityFunctions = new SteamCommunityFunctions(clientId);

  const soldAssetIds = new Set<AssetId>();
  const assetIdsOnConfirmation = new Set<AssetId>();

  const itemsThatNeedToBeSold = inventory.filter((i) => (sellOrders[i.marketHashName]?.isActive ? true : false));
  let confirmationCount = 0;
  try {
    for (const [index, item] of itemsThatNeedToBeSold.entries()) {
      const priceOrder = sellOrders[item.marketHashName][ECurrency[currency]];

      console.log(`Selling item with client id ${clientId} market hash name ${item.marketHashName},assetid ${item.assetId} and price ${priceOrder}`);
      await sellItemOnMarket(clientId, item.assetId, priceOrder)
        .then((r) => {
          if (r.requires_confirmation) confirmationCount++;
          assetIdsOnConfirmation.add(item.assetId);
        })
        .catch((error) => log.error(error, `Error selling item with market hash name ${item.marketHashName} assetid ${item.assetId}`));

      // max confirmation count you can have on steam is 250
      if (confirmationCount > 200) {
        // TODO: Find a way to accept only market transactions.
        await communityFunctions.acceptAllConfirmations();
        assetIdsOnConfirmation.forEach(soldAssetIds.add, soldAssetIds);
        assetIdsOnConfirmation.clear();

        await wait(5000);
      }

      if (index !== itemsThatNeedToBeSold.length - 1) {
        await wait(5000);
      }
    }

    await communityFunctions.acceptAllConfirmations();
    assetIdsOnConfirmation.forEach(soldAssetIds.add, soldAssetIds);
    assetIdsOnConfirmation.clear();
  } finally {
    return function (clientId: SteamId64, inventory: ParsedItemModel[]) {
      const newInventory = inventory.filter((i) => !soldAssetIds.has(i.assetId));
      o_newClientInventory.next({ clientId, data: newInventory });
    };
  }
}

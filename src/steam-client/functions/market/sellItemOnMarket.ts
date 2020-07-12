import { SteamId64 } from "../../../models/types/SteamId64";
import AssetId from "../../../models/types/AssetId";
import g_steamInstancesStores from "../../globals/g_steamInstancesStores";
import LogError from "../../../classes/errors/base/LogError";
import SellItemOnSteamMarketAPIModel from "../../../models/models/steam/steam-market/steamAPI/SellItemOnSteamMarketAPIModel";
import { calculateApiPrice } from "../../../business-logic/steam/calculateMarketplaceSellFee";

/**
 * Sells the item on the market
 * @param clientId
 * @param assetId
 * @param price the price is the price that the buyer pays
 */
export default function sellItemOnMarket(clientId: SteamId64, assetId: AssetId, price: number) {
  const community = g_steamInstancesStores?.[clientId]?.community;

  if (!community) {
    throw new LogError(`Community for client id ${clientId} is not found`);
  }

  price = calculateApiPrice(price);

  const sessionid = community.getSessionID();

  const sellOptions = {
    uri: "https://steamcommunity.com/market/sellitem/",
    formData: { sessionid, appid: 730, contextid: 2, assetid: assetId, amount: 1, price },
    headers: {
      referer: `https://steamcommunity.com/profiles/${clientId}/inventory`,
    },
  };

  return new Promise<SellItemOnSteamMarketAPIModel>((resolve, reject) => {
    community.httpRequestPost(sellOptions, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(result.body));
      }
    });
  });
}

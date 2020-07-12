import ECurrencyCode from "../../../../../declarations/steam-user/EcurrencyCode";
import promisifySteamCommunity from "../../../../../functions/promisify/promisifySteamCommunity";
import SteamCommunity from "steamcommunity";
import SteamMarketItemsOrderHistogramSteamAPIModel from "../../../../../models/models/steam/steam-market/steamAPI/SteamMarketItemsOrderHistogramSteamAPIModel";
import log from "../../../../../classes/logger/Log";
import StackTrace from "../../../../../classes/errors/StackTrace";
import { ECurrency } from "../../../../../models/enums/ECurrency";
import getECurrencyFromECurrencyCode from "../../../../../functions/steam/steam-market/getECurrencyFromECurrencyCode";
import wait from "../../../../../functions/wait";

export type getMarketOrdersHistogramType = {
  [k in keyof typeof ECurrency]?: SteamMarketItemsOrderHistogramSteamAPIModel;
};
export default async function getMarketOrdersHistogram(marketId: string, ip: string) {
  const community = promisifySteamCommunity(new SteamCommunity({ localAddress: ip }));

  const currencyCodes = [ECurrencyCode.USD, ECurrencyCode.EUR, ECurrencyCode.RUB];

  const record: getMarketOrdersHistogramType = {};
  for (const [index, code] of currencyCodes.entries()) {
    const uri = `https://steamcommunity.com/market/itemordershistogram?country=EN&language=english&currency=${code}&item_nameid=${marketId}&two_factor=0`;
    const options = { uri };
    await community
      .httpRequestGet(options)
      .then((result) => {
        const body = JSON.parse(result.body) as SteamMarketItemsOrderHistogramSteamAPIModel;
        if (!body.success) {
          log.error(new StackTrace(), `Getting item with marketId ${marketId} is not successful`);
          return;
        }
        const index = ECurrency[getECurrencyFromECurrencyCode(code)];

        record[index] = body;
      })
      .catch((err) => log.error(err));

    if (index !== currencyCodes.length - 1) {
      await wait(3000);
    }
  }

  return record;
}

import { PromisifiedSteamCommunity } from "../../../models/types/PromisifiedCommunity";
import GetMarketListingsSteamAPIModel from "../../../models/models/steam/steam-market/steamAPI/GetMarketListingsSteamAPIModel";

export default async function getMarketListingsAPIModel(
  community: PromisifiedSteamCommunity,
  start: number
): Promise<GetMarketListingsSteamAPIModel> {
  const httpOptions = {
    uri: `https://steamcommunity.com/market/mylistings/render/?query=&start=${start}&count=100`,

    headers: {
      referer: `https://steamcommunity.com/market/`,
    },
  };

  const result = await community.httpRequestGet(httpOptions);

  return JSON.parse(result.body);
}

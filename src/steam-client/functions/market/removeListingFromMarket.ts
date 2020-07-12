import { PromisifiedSteamCommunity } from "../../../models/types/PromisifiedCommunity";

export default async function removeListingFromMarket(community: PromisifiedSteamCommunity, listingId: string) {
  const sessionid = community.getSessionID();

  const options = {
    uri: "https://steamcommunity.com/market/removelisting/" + listingId,
    formData: { sessionid },
    headers: {
      referer: "https://steamcommunity.com/market",
    },
  };

  await community.httpRequestPost(options);
}

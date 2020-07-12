import GetMarketListingsSteamAPIModel from "../../../models/models/steam/steam-market/steamAPI/GetMarketListingsSteamAPIModel";
import createParsedItem from "../../../factories/createParsedItem";
import cheerio from "cheerio";
import LogError from "../../../classes/errors/base/LogError";
import { parseMarketPrice } from "../../../factories/ItemSellInformationParsedSteamAPIModel";
import areElementsEqual from "../../areElementsEqual";
import ParsedItemOnMarket from "../../../models/models/steam/steam-market/ParsedItemOnMarket";

export function extractMarketIdFromHref(href: string): string {
  const regexPattern = /(?<=\'mylisting\', \').*?(?=\')/;
  const regex = new RegExp(regexPattern);
  const result = regex.exec(href)?.toString();
  if (!result) {
    throw new LogError(`Couldn't extract market id from href, href:${href}`);
  }
  return result;
}
export default function parseMarketListingPage(marketApiResponse: GetMarketListingsSteamAPIModel) {
  if (!marketApiResponse) {
    throw new LogError("Market api response is null");
  }

  // filtering only the items that need to be sold.
  const csgoItems = Object.values(marketApiResponse.assets?.[730]?.[2] ?? {}).filter((i) => i.status === 2);
  if (!csgoItems) {
    return [];
  }
  const parsedItems = csgoItems.map(createParsedItem);

  const $ = cheerio.load(marketApiResponse.results_html);

  const marketIds = $(".item_market_action_button.item_market_action_button_edit.nodisable")
    .toArray()
    .map((e) => e.attribs["href"])
    .map(extractMarketIdFromHref);

  const prices = $(`span[title="This is the price the buyer pays."]`)
    .toArray()
    .map((e) => e.firstChild.nodeValue.trim())
    .map(parseMarketPrice);

  if (!areElementsEqual(prices.length, marketIds.length, parsedItems.length)) {
    throw new LogError(`Elements are not equal, prices ${prices.length} marketIds ${marketIds.length} parsedItems ${parsedItems.length}`);
  }
  const result: ParsedItemOnMarket[] = parsedItems.map((item, index) => ({ ...item, marketPrice: prices[index], marketListingId: marketIds[index] }));

  return result;
}

import g_itemsPricesSchema from "../../globals/g_itemsPricesSchema";
import requestAndSetPriceSchema from "./items/requestAndSetPriceSchema";

export default async function checkForNoItemsWithPriceSchema(marketHashNames: string[]) {
  const missingSchemas = new Set<string>();
  for (const name of marketHashNames) {
    if (g_itemsPricesSchema[name]) {
      continue;
    }
    missingSchemas.add(name);
  }
  await requestAndSetPriceSchema(missingSchemas);
}

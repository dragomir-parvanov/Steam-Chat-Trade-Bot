import Axios from "axios";
import ItemSellInformationModel from "../../../../models/models/steam/steam-market/ItemSellInformationModel";
import g_itemsPricesSchema from "../../../globals/g_itemsPricesSchema";
import { onNoPriceSchemaFound } from "../../../../factories/mongo/createParsedItemWithSellInformationModel";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import getItemsPriceSchema from "../initial-loading/getItemsPriceSchema";

export default async function requestAndSetPriceSchema(marketHashNames: Set<string>) {
  if (marketHashNames.size === 0) {
    return;
  }
  // const items = await mainConnect.items.getItemsSellInformation([...marketHashNames]);
  // items.forEach((i) => {
  //   g_itemsPricesSchema[i._id] = i;
  // });

  // // some items are not in the database, so we gonna improvise.
  // marketHashNames.forEach((n) => {
  //   if (!items.some((i) => i._id === n)) {
  //     const info = onNoPriceSchemaFound(n);
  //     g_itemsPricesSchema[n] = info;
  //   }
  // });
  const schema = await getItemsPriceSchema(marketHashNames);
  Object.assign(g_itemsPricesSchema, schema);
}

import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import ItemSellInformationModel from "../../../../models/models/steam/steam-market/ItemSellInformationModel";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import { onNoPriceSchemaFound } from "../../../../factories/mongo/createParsedItemWithSellInformationModel";

export default async function getItemsPriceSchema(marketHashNames: Set<string>): Promise<Record<string, ItemSellInformationModel>> {
  const schemas = await mainConnect.items.getItemsSellInformation([...marketHashNames]);

  const recordSchemas: Record<string, ItemSellInformationModel> = {};
  marketHashNames.forEach((n) => {
    if (!schemas.some((i) => i._id === n)) {
      const info = onNoPriceSchemaFound(n);
      recordSchemas[n] = info;
    }
  });
  schemas.forEach((s) => (recordSchemas[s._id] = s));

  return recordSchemas;
}

import RecordFunctions from "../../../../classes/RecordFunctions";

import requestAndSetPriceSchema from "../items/requestAndSetPriceSchema";
import g_clientActiveChats from "../../../globals/g_clientActiveChats";
import { SteamId64 } from "../../../../models/types/SteamId64";
import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import createItemWithSellInformationFromSchema from "../../../factories/createItemWithSellInformationFromSchema";
import NoItemSchemaFoundError from "../../../../classes/errors/NoItemSchemaFoundError";
import g_itemsPricesSchema from "../../../globals/g_itemsPricesSchema";
import g_clientInventoriesWithSellInformation from "../../../globals/g_clientInventoriesWithSellInformation";
import ParsedItemWithSellInformationModel from "../../../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";
import ActiveChatModel from "../../../../models/ActiveChatModel";

export default async function initializeItemsPriceSchema(clientInventories: Record<SteamId64, ParsedItemModel[]>, chats: ActiveChatModel[]) {
  const marketHashNames = new Set<string>();
  chats.forEach((c) => {
    c.partnerInventory.items.forEach((i) => marketHashNames.add(i.marketHashName));
  });
  RecordFunctions.forEach(clientInventories, (items) => {
    items.forEach((i) => marketHashNames.add(i.marketHashName));
  });

  await requestAndSetPriceSchema(marketHashNames);

  RecordFunctions.forEach(clientInventories, (items, id) => {
    g_clientInventoriesWithSellInformation[id] = new UpdatingSubject(
      items
        .map<ParsedItemWithSellInformationModel>((i) => {
          const schema = g_itemsPricesSchema[i.marketHashName];
          if (!schema) {
            throw new NoItemSchemaFoundError(i.marketHashName);
          }
          return createItemWithSellInformationFromSchema(schema, i);
        })
        .sort((a, b) => b.averagePrice - a.averagePrice)
    );
  });
}

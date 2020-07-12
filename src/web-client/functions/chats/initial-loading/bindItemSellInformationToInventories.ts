import { SteamId64 } from "../../../../models/types/SteamId64";
import ParsedItemModel from "../../../../models/models/steam/steam-items/ParsedItemModel";
import g_clientActiveChats from "../../../globals/g_clientActiveChats";
import SteamInventoryModel from "../../../../models/models/steam/steam-items/SteamInventoryModel";
import g_itemsPricesSchema from "../../../globals/g_itemsPricesSchema";
import ClientActiveChatModel from "../../../models/ClientActiveChat";
import SteamInventoryWithSellInformationModel from "../../../models/SteamInventoryWithSellInformation";
import g_clientInventoriesWithSellInformation from "../../../globals/g_clientInventoriesWithSellInformation";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";
import NoItemSchemaFoundError from "../../../../classes/errors/NoItemSchemaFoundError";
import createItemWithSellInformationFromSchema from "../../../factories/createItemWithSellInformationFromSchema";

export default async function bindItemSellInformationToInventories(clientInventories: Record<SteamId64, ParsedItemModel[]>) {
  for (const key in g_clientActiveChats) {
    g_clientActiveChats[key].update((c) => {
      const a = c.partnerInventory as SteamInventoryModel;
      const items = a.items.map((i) => {
        const schema = g_itemsPricesSchema[i.marketHashName];

        if (!schema) {
          new NoItemSchemaFoundError(i.marketHashName);
        }

        return createItemWithSellInformationFromSchema(schema, i);
      });
      a.items = items;
      const inventory: SteamInventoryWithSellInformationModel = { ...c.partnerInventory, items };
      const chatWithSellInformation: ClientActiveChatModel = { ...c, ...inventory };
      return chatWithSellInformation;
    });
  }
  for (const key in clientInventories) {
    const items = clientInventories[key].map((i) => {
      const schema = g_itemsPricesSchema[i.marketHashName];

      if (!schema) {
        new NoItemSchemaFoundError(i.marketHashName);
      }

      return createItemWithSellInformationFromSchema(schema, i);
    });
    g_clientInventoriesWithSellInformation[key] = new UpdatingSubject(items);
  }
}

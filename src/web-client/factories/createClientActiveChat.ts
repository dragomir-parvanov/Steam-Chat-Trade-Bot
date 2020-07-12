import ActiveChatModel from "../../models/ActiveChatModel";
import ClientActiveChatModel from "../models/ClientActiveChat";
import SteamInventoryWithSellInformationModel from "../models/SteamInventoryWithSellInformation";
import ParsedItemWithSellInformationModel from "../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import LogError from "../../classes/errors/base/LogError";
import g_itemsPricesSchema from "../globals/g_itemsPricesSchema";
import createItemSellInformationParsedSteamAPIModel from "../../factories/ItemSellInformationParsedSteamAPIModel";
import createItemWithSellInformationFromSchema from "./createItemWithSellInformationFromSchema";

export default function createClientActiveChat(chat: ActiveChatModel): ClientActiveChatModel {
  const { partnerInventory } = chat;

  const items: ParsedItemWithSellInformationModel[] = partnerInventory.items
    .map((i) => {
      const schema = g_itemsPricesSchema[i.marketHashName];
      if (!schema) {
        throw new LogError(`Schema for item with name ${i.marketHashName} is not found`);
      }

      return createItemWithSellInformationFromSchema(schema, i);
    })
    .sort((a, b) => b.lowestPrice - a.lowestPrice);
  const newInventory: SteamInventoryWithSellInformationModel = { ...partnerInventory, items };
  const result: ClientActiveChatModel = {
    ...chat,
    partnerInventory: newInventory,
    isChecked: true,
  };
  result.addedOn = new Date(result.addedOn);
  if (result.partnerProfile.memberSince) result.partnerProfile.memberSince = new Date(result.partnerProfile.memberSince);

  return result;
}

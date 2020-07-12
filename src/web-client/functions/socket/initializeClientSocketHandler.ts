import io from "socket.io-client";
import socketIORoute from "../../../shared-network/socket-io/socketIORoutes";
import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import createDoubleIdentification from "../../../functions/doubleIdentification";
import ActiveChatModel from "../../../models/ActiveChatModel";
import UpdatingSubject from "../../../classes/rxjs-extending/UpdatingSubject";
import g_chatMessages from "../../globals/g_chatMessages";
import checkForNoItemsWithPriceSchema from "../chats/checkForNoItemsWithPriceSchema";
import o_chatIds from "../../globals/observables/o_chatIds";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import WithClientId from "../../../models/templates/WithClientId";
import AtLeast from "../../../models/types/AtLeast";
import g_clientInventoriesWithSellInformation from "../../globals/g_clientInventoriesWithSellInformation";
import g_itemsPricesSchema from "../../globals/g_itemsPricesSchema";
import g_clientActiveChats from "../../globals/g_clientActiveChats";
import SteamInventoryWithSellInformationModel from "../../models/SteamInventoryWithSellInformation";
import ClientActiveChatModel from "../../models/ClientActiveChat";
import NoItemSchemaFoundError from "../../../classes/errors/NoItemSchemaFoundError";
import createItemWithSellInformationFromSchema from "../../factories/createItemWithSellInformationFromSchema";
import bindMessageJSXBuilder from "../chats/initial-loading/bindMessageJSXBuilder";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";
import { isOfferType } from "../chats/pushJSXMessage";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import g_cachedTradeOffers from "../../globals/g_cachedTradeOffers";
import setAllTradeOffersFromMessages from "../chats/initial-loading/setAllTradeOffersFromMessages";
import o_newMessages from "../../../shared-network/globals/observables/chat-related/o_newMessages";
import createClientActiveChat from "../../factories/createClientActiveChat";
import bindAttributesToChat from "../chats/bindAttributesToChat";
let alreadyInitialized = false;
export default function initializeClientSocketHandler() {
  if (alreadyInitialized) {
    return;
  }
  alreadyInitialized = true;
  const socket = io();
  socket.on("newChat" as socketIORoute, async (chat: ActiveChatModel) => {
    console.log("NEW CHAT");
    const { clientId, partnerId } = chat;
    const id = createDoubleIdentification(clientId, partnerId);
    await checkForNoItemsWithPriceSchema(chat.partnerInventory.items.map((i) => i.marketHashName));

    const clientChat: ClientActiveChatModel = createClientActiveChat(chat);

    const messages = await mainConnect.chats.messages.getSpecificMessages(clientId, partnerId, new Date().getTime());
    if (g_chatMessages[id]) {
      g_chatMessages[id].previous.unshift(...messages);
    } else {
      g_chatMessages[id] = {
        previous: messages,
        new: new UpdatingSubject<SteamChatMessageModel[]>([]),
      };
    }

    await setAllTradeOffersFromMessages(messages);
    if (g_clientActiveChats[id]) {
      g_clientActiveChats[id].update((v) => ({ ...v, ...clientChat }));
    } else {
      g_clientActiveChats[id] = new UpdatingSubject(clientChat);
    }
    bindAttributesToChat(g_clientActiveChats[id]);

    o_chatIds.update((prev) => prev.add(id));
  });

  socket.on("newMessage" as socketIORoute, async (message: SteamChatMessageModel) => {
    console.log("NEW MESSAGE", message);
    o_newMessages.next(message);
    if ((message.type as never) !== ETradeOfferState.JustCreated && isOfferType(message.type)) {
      mainConnect.items.offers.getOfferById(message.value).then((offer) => {
        g_cachedTradeOffers[message.value] = offer;
      });
    }

    const id = createDoubleIdentification(message.clientId, message.partnerId);

    const messages = g_chatMessages[id];
    if (!messages) {
      g_chatMessages[id] = { new: new UpdatingSubject([] as any), previous: [message] };
      return;
    }
    if (!g_clientActiveChats[id]) {
      // the active chat is still not available to append the messages to "new" messages
      g_chatMessages[id].previous.push(message);
      return;
    }
    const chatSubject = g_clientActiveChats[id];
    if (chatSubject) {
      const chat = chatSubject.getValue();
      if (!chat.isActive) {
        chatSubject.next({ ...chat, isActive: true });
      }
    }
    if (isOfferType(message.type) && (message.type as never) !== ETradeOfferState.JustCreated) {
      await setAllTradeOffersFromMessages([message]);
    }
    g_chatMessages[id].new.update((v) => [...v, message]);
  });
  socket.on("chatUpdate", async (update: AtLeast<ActiveChatModel, "clientId" | "partnerId">) => {
    console.log("NEW CHAT UPDATE", update);
    const id = createDoubleIdentification(update.clientId, update.partnerId);
    if (update.partnerInventory) {
      await checkForNoItemsWithPriceSchema(update.partnerInventory.items.map((i) => i.marketHashName));
      const items = update.partnerInventory.items.map((i) => {
        const schema = g_itemsPricesSchema[i.marketHashName];

        if (!schema) {
          throw new NoItemSchemaFoundError(i.marketHashName);
        }

        return createItemWithSellInformationFromSchema(schema, i);
      });
      const inventoryUpdate: SteamInventoryWithSellInformationModel = { ...update.partnerInventory, items };

      g_clientActiveChats[id].update((prev) => ({ ...prev, ...(update as any), partnerInventory: inventoryUpdate }));
    } else {
      g_clientActiveChats[id].update((prev) => ({ ...prev, ...(update as any) }));
    }
  });
  socket.on("newClientInventory" as socketIORoute, async (inventory: WithClientId<ParsedItemModel[]>) => {
    await checkForNoItemsWithPriceSchema(inventory.data.map((i) => i.marketHashName));
    const items = inventory.data
      .map((i) => {
        const schema = g_itemsPricesSchema[i.marketHashName];

        if (!schema) {
          throw new NoItemSchemaFoundError(i.marketHashName);
        }

        return createItemWithSellInformationFromSchema(schema, i);
      })
      .sort((a, b) => b.averagePrice - a.averagePrice);
    if (g_clientInventoriesWithSellInformation[inventory.clientId]) {
      g_clientInventoriesWithSellInformation[inventory.clientId].next(items);
    } else {
      g_clientInventoriesWithSellInformation[inventory.clientId] = new UpdatingSubject(items);
    }
  });
}

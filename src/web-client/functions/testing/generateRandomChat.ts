import generateGUID from "../../../functions/generateGUID";
import createDoubleIdentification from "../../../functions/doubleIdentification";
import g_chatMessagesJSX from "../../globals/g_chatMessagesJSX";
import UpdatingSubject from "../../../classes/rxjs-extending/UpdatingSubject";
import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import g_activeChats from "../../../shared-network/globals/observables/chat-related/g_activeChats";
import ActiveChatModel from "../../../models/ActiveChatModel";
import { EActiveChatTriggerAction } from "../../../models/enums/EActiveChatTriggerAction";
import { EInventoryGetStatus } from "../../../models/enums/EInventoryGetStatus";
import o_newChats from "../../../shared-network/globals/observables/chat-related/o_newChats";
import o_chatIds from "../../globals/observables/o_chatIds";
import generateRandomMessage from "./generateRandomMessage";
import g_chatMessages from "../../globals/g_chatMessages";
import bindMessageJSXBuilder from "../chats/initial-loading/bindMessageJSXBuilder";
import ClientActiveChatModel from "../../models/ClientActiveChat";
import g_clientActiveChats from "../../globals/g_clientActiveChats";
import generateRandomXMLParsedProfile from "./generateRandomXMLParsedProfile";
import generateRandomTradingInformation from "./generateRandomTradingInformation";
import chance from "../../../functions/chance";
import generateRandomItemWithSellInformation from "./generateRandomItemWithSellInformation";
import generateStreamMessages from "./generateStreamMessages";
import generateRandomInventoryItems from "./generateRandomInventoryItems";
import g_clientInventoriesWithSellInformation from "../../globals/g_clientInventoriesWithSellInformation";
let partnerIdZ = 0;
let clientIdZ = 0;
export default function generateRandomChat() {
  const clientId = (clientIdZ++).toString();
  const partnerId = (partnerIdZ++).toString();
  const id = createDoubleIdentification(clientId, partnerId);
  // maybe check for messages
  const items = generateRandomInventoryItems(100, 10);
  const chat: ClientActiveChatModel = {
    addedOn: new Date(),
    triggerAction: EActiveChatTriggerAction.FriendMessage,
    clientId,
    partnerId,
    partnerInventory: { getStatus: EInventoryGetStatus.Ok, items },
    personaState: 3,
    isActive: true,
    partnerProfile: generateRandomXMLParsedProfile(),
    tradingInformation: generateRandomTradingInformation(),
    stateMessage: chance.hashtag(),
    isChecked: false,
  };
  g_chatMessages[id] = {
    new: new UpdatingSubject<SteamChatMessageModel[]>([]),
    previous: [generateRandomMessage(clientId, partnerId)],
  };
  g_chatMessagesJSX[id] = {
    previous: [],
    new: new UpdatingSubject<JSX.Element[]>([]),
  };

  bindMessageJSXBuilder(clientId, partnerId);
  g_clientActiveChats[id] = new UpdatingSubject(chat);
  const clientItems = generateRandomInventoryItems(100, 5);
  g_clientInventoriesWithSellInformation[clientId] = new UpdatingSubject(clientItems);
  o_chatIds.update((chats) => chats.add(id));
  generateStreamMessages(clientId, partnerId);
}

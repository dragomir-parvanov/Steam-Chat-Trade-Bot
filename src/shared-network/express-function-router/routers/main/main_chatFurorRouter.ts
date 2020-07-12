import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import EHTTPMethods from "../../../../models/enums/EHTTPMethods";
import { fr_removeFriend, fr_getAllActiveChats, fr_rescanAfterDays, fr_sendOfferInChat } from "../../../../main-server/src/routes/chats/chatsRouter";
import checkUserClaims from "../../../../main-server/src/passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import { fr_sendMessage, fr_getAllMessages, fr_getSpecificMessages } from "../../../../main-server/src/routes/chats/messagesRouter";
import sendOffer from "../../../../steam-client/functions/offers/sendOffer";

export const main_chatFurorRouter = validateType<ExpressFunctionRouter>()({
  removeFriend: {
    type: EHTTPMethods.patch,
    func: fr_removeFriend,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
  },
  getAllActiveChats: {
    type: EHTTPMethods.get,
    func: fr_getAllActiveChats,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
  },
  rescanFriend: {
    type: EHTTPMethods.patch,
    func: fr_rescanAfterDays,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
  },
  messages: {
    sendMessage: {
      type: EHTTPMethods.post,
      func: fr_sendMessage,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
    },
    sendTradeOffer: {
      type: EHTTPMethods.post,
      func: fr_sendOfferInChat,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
      shouldBindRequest: true,
    },
    getAllMessages: {
      type: EHTTPMethods.get,
      func: fr_getAllMessages,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
    },
    getSpecificMessages: {
      type: EHTTPMethods.get,
      func: fr_getSpecificMessages,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
    },
  },
});

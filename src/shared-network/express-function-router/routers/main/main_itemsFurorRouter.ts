import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import EHTTPMethods from "../../../../models/enums/EHTTPMethods";
import { fr_getItemsSellInformation } from "../../../../main-server/src/routes/items/itemsRouter";
import checkUserClaims from "../../../../main-server/src/passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import {
  fr_getOffersByIds,
  fr_getOffer,
  fr_getOffersWithQuery,
  fr_offersSummary as fr_getOffersSummary,
  fr_getTradeOfferDetailsFromTradeLink,
  fr_sendTradeOfferFromTradeLink,
} from "../../../../main-server/src/routes/items/offersRouter";
import main_marketFurorRouter from "./main_marketFurorRouter";

const main_itemsFurorRouter = validateType<ExpressFunctionRouter>()({
  getItemsSellInformation: {
    type: EHTTPMethods.get,
    func: fr_getItemsSellInformation,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage, ERegisteredUserClaim.ClientsManagement)],
  },
  offers: {
    getTradeOfferDetailsFromTradeLink: {
      type: EHTTPMethods.get,
      func: fr_getTradeOfferDetailsFromTradeLink,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
    },
    sendOfferFromTradeLink: {
      type: EHTTPMethods.post,
      func: fr_sendTradeOfferFromTradeLink,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ClientsManagement)],
      shouldBindRequest: true,
    },
    getOffersById: {
      type: EHTTPMethods.get,
      func: fr_getOffersByIds,
    },
    getOfferById: {
      type: EHTTPMethods.get,
      func: fr_getOffer,
    },
    getOffersWithQuery: {
      type: EHTTPMethods.get,
      func: fr_getOffersWithQuery,
      shouldBindRequest: true,
    },
    getOffersSummary: {
      type: EHTTPMethods.get,
      func: fr_getOffersSummary,
      //middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.ChatPage)],
      shouldBindRequest: true,
    },
  },
});

export default main_itemsFurorRouter;

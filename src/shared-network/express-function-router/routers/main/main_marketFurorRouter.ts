import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import {
  fr_updateMarketSellOrders,
  fr_getMarketStatus,
  fr_getMarketSellOrders,
  fr_updateMarketStatus,
  fr_sellItemsOnMarketByPrice,
  fr_getAllMarketOrdersHistogramFromSellOrders,
} from "../../../../main-server/src/routes/items/marketRouter";
import EHTTPMethods from "../../../../models/enums/EHTTPMethods";
import checkUserClaims from "../../../../main-server/src/passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import { fr_updateMiningStatus } from "../../../../main-server/src/routes/mining/miningRouter";
import getAllMarketListings from "../../../../steam-client/functions/market/getAllMarketListings";
import sellItemsOnMarketByPrice from "../../../../main-server/src/functions/childs/market/sellItemsOnMarketByPrice";
import removeListingFromMarket from "../../../../steam-client/functions/market/removeListingFromMarket";
import removeItemsFromMarket from "../../../../main-server/src/functions/childs/market/removeItemsFromMarket";

const main_marketFurorRouter = validateType<ExpressFunctionRouter>()({
  updateMarketSellOrders: {
    func: fr_updateMarketSellOrders,
    type: EHTTPMethods.patch,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
  updateMarketStatus: {
    func: fr_updateMarketStatus,
    type: EHTTPMethods.patch,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
  getMarketStatus: {
    func: fr_getMarketStatus,
    type: EHTTPMethods.get,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
  getMarketSellOrders: {
    func: fr_getMarketSellOrders,
    type: EHTTPMethods.get,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
  getAllMarketListings: {
    func: getAllMarketListings,
    type: EHTTPMethods.get,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
  sellItemsOnMarketByPrice: {
    func: fr_sellItemsOnMarketByPrice,
    type: EHTTPMethods.post,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
  removeItemsFromMarket: {
    func: removeItemsFromMarket,
    type: EHTTPMethods.patch,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
  getAllMarketOrdersHistogramFromSellOrders: {
    func: fr_getAllMarketOrdersHistogramFromSellOrders,
    type: EHTTPMethods.get,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MarketManagement)],
  },
});

export default main_marketFurorRouter;

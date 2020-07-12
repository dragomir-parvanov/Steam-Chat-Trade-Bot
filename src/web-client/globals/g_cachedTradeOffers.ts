import TradeOfferModel from "../../models/models/steam/steam-offers/TradeOfferModel";

/**
 * Every trade offer should be here
 */
const g_cachedTradeOffers: Record<string, TradeOfferModel> = {};

export default g_cachedTradeOffers;

import { Subject } from "rxjs";
import TradeOfferModel from "../../../../models/models/steam/steam-offers/TradeOfferModel";

const o_sentOfferChanged = new Subject<TradeOfferModel>();

export default o_sentOfferChanged;

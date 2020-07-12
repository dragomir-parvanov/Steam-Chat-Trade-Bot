import ParsedItemWithSellInformationModel from "../steam-items/ParsedItemWithSellInformationModel";
import Identifiable from "../../../../data/identifiables/Identifiable";
import { SteamId64 } from "../../../types/SteamId64";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import ClientAndPartnerIdentfiables from "../../../interfaces/ClientAndPartnerIdentfiables";

export default interface TradeOfferModel extends Identifiable<string>, ClientAndPartnerIdentfiables {
  /**
   * This is the offer id.
   * @type {number}
   * @memberof TradeOfferModel
   */
  _id: string;

  /**
   * The id of the client that made this trade.
   * @type {SteamId64}
   * @memberof TradeOfferModel
   */
  clientId: SteamId64;

  /**
   * The current state of the trade offer.
   * @type {ETradeOfferState}
   * @memberof TradeOfferModel
   */
  state: ETradeOfferState;

  /**
   * When the trade was made.
   * @type {Date}
   * @memberof TradeOfferModel
   */
  madeOn: Date;

  /**
   * When the trade was updated for the last time.
   * @type {Date}
   * @memberof TradeOfferModel
   */
  actedOn: Date;

  /**
   * The profit from the trade.
   * @type {number}
   * @memberof TradeOfferModel
   */
  profit: number;

  /**
   * The items we received in the trade.
   * @type {ParsedItemWithSellInformationModel[]}
   * @memberof TradeOfferModel
   */
  itemsToGive: ParsedItemWithSellInformationModel[];

  /**
   * The items we gave in the trade.
   * @type {ParsedItemWithSellInformationModel[]}
   * @memberof TradeOfferModel
   */
  itemsToReceive: ParsedItemWithSellInformationModel[];

  /**
   * By who the offer was made.
   * @type {string}
   * @memberof TradeOfferModel
   */
  madeByWorker: string;

  /**
   * The message that is appended to the trade offer.
   * @type {string}
   * @memberof TradeOfferModel
   */
  message?: string;

  /**
   * Whenever the offer is maintance one
   */
  isMaintanceOffer: boolean;
}

import Identifiable from "../../../../data/identifiables/Identifiable";
import { SteamId64 } from "../../../types/SteamId64";


/**
 *
 *
 * @export
 * @interface TradeOfferManagerPollData
 * @extends {Identifiable<SteamId64>}
 */
export default interface TradeOfferManagerPollData extends Identifiable<SteamId64>{

    _id: SteamId64;

    /**
     * The poll data which the manager can use to resume his scanning.
     * @type {unknown}
     * @memberof TradeOfferManagerPollData
     */
    data: unknown;
}
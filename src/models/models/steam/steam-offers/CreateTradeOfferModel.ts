import ClientAndPartnerIdentfiables from "../../../interfaces/ClientAndPartnerIdentfiables";
import ParsedItemWithSellInformationModel from "../steam-items/ParsedItemWithSellInformationModel";

export default interface CreateTradeOfferModel extends ClientAndPartnerIdentfiables {
  clientItems: ParsedItemWithSellInformationModel[];
  partnerItems: ParsedItemWithSellInformationModel[];
}

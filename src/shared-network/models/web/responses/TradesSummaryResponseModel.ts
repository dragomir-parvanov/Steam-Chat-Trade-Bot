import enumMembersToString from "../../../../functions/enumFunctions";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import SumAndTotalModel from "../../../../models/SumAndTotalModel";
import Identifiable from "../../../../data/identifiables/Identifiable";
import ValueOf from "../../../../models/types/ValueOf";
export interface TradesSummaryValueModel extends SumAndTotalModel, Identifiable<ETradeOfferState> {
  _id: ETradeOfferState;
}

type TradesSummaryResponseModel = {
  [i in ValueOf<typeof ETradeOfferState>]: TradesSummaryValueModel;
};
export default TradesSummaryResponseModel;

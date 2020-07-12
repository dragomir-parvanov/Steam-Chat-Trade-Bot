import { ECurrency } from "../../../enums/ECurrency";
import Identifiable from "../../../../data/identifiables/Identifiable";
type MarketSellOrderModel = {
  // at what price we put the item at
  [i in keyof typeof ECurrency]: number;
} &
  Identifiable<string> & {
    /**
     * The market hash name of the item
     */
    _id: string;
    /**
     * If the listing is active
     */
    isActive: boolean;
  };
export default MarketSellOrderModel;

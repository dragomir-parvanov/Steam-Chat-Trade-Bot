import * as React from "react";
import SmallChat from "./chat/SmallChat";
import ChatPage from "./chat/ChatPage";
import TradeSummary from "../common/TradeSummary";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import OffersSummary from "./OffersSummary";
import ClientsManagement from "./client-management/ClientsManagement";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";
import WorkerClientModel from "../../../models/WorkerClientModel";
import ClientManagement from "./client-management/ClientManagement";
import SellItemsOnMarket from "./market/SellItemsOnMarket";

export interface HomeProps {}

export interface HomeState {}

export default class Home extends React.Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
  }

  componentDidMount = async () => {};
  public render() {
    return <div>Hello</div>;
  }
}

import * as React from "react";
import { Progress } from "antd";
import Title from "antd/lib/typography/Title";
import getAllClientInventories from "../../../functions/chats/initial-loading/getAllClientInventories";
import setAllMessages from "../../../functions/chats/initial-loading/setAllMessages";
import initializeClientSocketHandler from "../../../functions/socket/initializeClientSocketHandler";
import getAndSetAllMessages from "../../../functions/chats/initial-loading/getAndSetAllMessages";
import initializeItemsPriceSchema from "../../../functions/chats/initial-loading/initializeItemsPriceSchema";
import ChatPage from "./ChatPage";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import d_userHasClaim from "../../../functions/decorators/d_userHasClaim";
import o_chatIds from "../../../globals/observables/o_chatIds";
import bindMessageJSXBuilder from "../../../functions/chats/initial-loading/bindMessageJSXBuilder";
import setAllTradeOffersFromMessages from "../../../functions/chats/initial-loading/setAllTradeOffersFromMessages";
import g_cachedTradeOffers from "../../../globals/g_cachedTradeOffers";
import createDoubleIdentification, { destroyDoubleIdentification } from "../../../../functions/doubleIdentification";
import sortItemsByPrice from "../../../functions/chats/items/sortItemsByPrice";
import g_clientActiveChats from "../../../globals/g_clientActiveChats";
import g_clientsInventories from "../../../../shared-network/globals/observables/chat-related/g_clientsInventories";
import g_clientInventoriesWithSellInformation from "../../../globals/g_clientInventoriesWithSellInformation";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import createClientActiveChat from "../../../factories/createClientActiveChat";
import UpdatingSubject from "../../../../classes/rxjs-extending/UpdatingSubject";
import bindAttributesToChat from "../../../functions/chats/bindAttributesToChat";

export interface ChatPageLoadingProps {}

export interface ChatPageLoadingState {
  loadingPercent: number;
  loadingStatus: string;
  finished: boolean;
}

@d_userHasClaim(ERegisteredUserClaim.ChatPage)
export default class ChatPageLoading extends React.Component<ChatPageLoadingProps, ChatPageLoadingState> {
  constructor(props: ChatPageLoadingProps) {
    super(props);

    this.state = { loadingPercent: 0, loadingStatus: "Initializing component", finished: false };
  }
  componentDidMount = async () => {
    console.log("loading called");
    this.setState({ loadingStatus: "Getting client inventories" });
    const clientInventories = await getAllClientInventories();
    this.setState({ loadingStatus: "Getting chats", loadingPercent: 10 });
    const beforeTime = new Date().getTime();
    const chats = await mainConnect.chats.getAllActiveChats();

    this.setState({ loadingStatus: "Connecting to the socket server", loadingPercent: 40 });
    initializeClientSocketHandler();

    this.setState({ loadingStatus: "Getting messages", loadingPercent: 45 });
    const messages = await getAndSetAllMessages(beforeTime);
    this.setState({ loadingStatus: "Getting trade offers from messages", loadingPercent: 65 });
    await setAllTradeOffersFromMessages(messages);

    console.log("g_tradeoffers", g_cachedTradeOffers);
    this.setState({ loadingStatus: "Getting items sell information", loadingPercent: 75 });

    await initializeItemsPriceSchema(clientInventories, chats);

    this.setState({ loadingStatus: "Generating JSX", loadingPercent: 90 });
    const clientActiveChats = chats.map((c) => createClientActiveChat(c));
    clientActiveChats.forEach((c) => {
      const id = createDoubleIdentification(c.clientId, c.partnerId);
      const subject = new UpdatingSubject(c);
      g_clientActiveChats[id] = subject;
      bindAttributesToChat(subject);
    });
    o_chatIds.next(new Set(clientActiveChats.map((c) => createDoubleIdentification(c.clientId, c.partnerId))));
    this.setState({ loadingStatus: "sorting items", loadingPercent: 95 });

    this.setState({ loadingStatus: "Finished", loadingPercent: 100, finished: true });
  };

  public render() {
    if (this.state.finished) {
      return <ChatPage />;
    }
    return (
      <div className="centered">
        <Title>{this.state.loadingStatus}</Title>
        <Progress percent={this.state.loadingPercent} status="active" />
      </div>
    );
  }
}

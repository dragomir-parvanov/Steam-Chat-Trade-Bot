import * as React from "react";
import ActiveChatModel from "../../../../models/ActiveChatModel";
import ClientAndPartnerIdentfiables from "../../../../models/interfaces/ClientAndPartnerIdentfiables";
import d_rxjsStateMap from "../../../functions/decorators/d_rxjsStateMap";
import o_chatIds from "../../../globals/observables/o_chatIds";
import { Layout, Pagination, notification, message } from "antd";
import SmallChat from "./SmallChat";
import generateGUID from "../../../../functions/generateGUID";
import createDoubleIdentification, { destroyDoubleIdentification } from "../../../../functions/doubleIdentification";
import { changeNextValue } from "../../../../functions/rxjs/changeNextValue";
import ChatPastAction from "./ChatPastAction";
import ESteamChatMessageType from "../../../../models/enums/ESteamChatMessageType";
import o_newMessages from "../../../../shared-network/globals/observables/chat-related/o_newMessages";
import g_clientActiveChats from "../../../globals/g_clientActiveChats";
import log from "../../../../classes/logger/Log";
import StackTrace from "../../../../classes/errors/StackTrace";
import messageShouldHaveAttention from "../../../functions/chats/messageShouldHaveAttention";
import o_currentObservedChat from "../../../globals/observables/o_currentObservedChat";

export interface ChatPageProps {}

export interface ChatPageState {
  chatIds: string[];
  currentPage: number;
  chatWidthPercent: number;
  chatHeightPercent: number;
  chatPaddingHorizontalPercent: number;
  chatPaddingVerticalPercent: number;
  chatContainers: JSX.Element[];
  spaces: number;
  pastActions: JSX.Element[];
}

const { Footer, Content } = Layout;
@d_rxjsStateMap<ChatPageState>({ chatIds: changeNextValue(o_chatIds, (v) => [...v]) })
export default class ChatPage extends React.Component<ChatPageProps, ChatPageState> {
  constructor(props: ChatPageProps) {
    super(props);
    this.state = {
      currentPage: 1,
      chatIds: [],
      chatHeightPercent: 30,
      chatWidthPercent: 10,
      chatPaddingHorizontalPercent: 0.5,
      chatPaddingVerticalPercent: 1,
      chatContainers: [],
      spaces: 0,
      pastActions: [],
    };
  }

  handlePageChange = (page: number) => {
    this.setState({ currentPage: page }, this.getChatContainers);
  };

  getChatContainers = () => {
    const chatContainers: JSX.Element[] = [];
    const { currentPage, chatIds, chatWidthPercent, chatHeightPercent, chatPaddingHorizontalPercent, chatPaddingVerticalPercent } = this.state;
    const initialSize = 100;
    const rows = Math.floor(initialSize / (chatWidthPercent + chatPaddingVerticalPercent * 2));
    const columns = Math.floor(initialSize / (chatHeightPercent + chatPaddingHorizontalPercent * 2));
    const spaces = rows * columns;
    const chatsToRender: JSX.Element[] = [];
    const start = spaces * (currentPage - 1);

    for (let i = start; i < start + spaces; i++) {
      if (!chatIds[i]) {
        break;
      }

      const [clientId, partnerId] = destroyDoubleIdentification(chatIds[i]);

      const id = createDoubleIdentification(clientId, partnerId);
      chatsToRender.push(<SmallChat key={id} clientId={clientId} partnerId={partnerId} />);
    }
    let shouldBreak = false;
    for (let column = 0, chatIndex = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++, chatIndex++) {
        const chat = chatsToRender[chatIndex];
        if (!chat) {
          shouldBreak = true;
          break;
        }

        const left = row * chatWidthPercent + chatPaddingHorizontalPercent + chatPaddingHorizontalPercent + row + "%";
        const top = column * chatHeightPercent + chatPaddingVerticalPercent + chatPaddingVerticalPercent * column + "%";
        const width = chatWidthPercent + "%";
        const height = chatHeightPercent + "%";

        chatContainers.push(<div style={{ position: "absolute", left, top, width, height }}>{chat}</div>);
      }
      if (shouldBreak) {
        break;
      }
    }
    return { chatContainers, spaces };
  };

  newMessageSubscription = o_newMessages.subscribe({
    next: (m) => {
      if (!messageShouldHaveAttention(m)) {
        return;
      }
      this.setState(({ pastActions }) => {
        const newState = [...pastActions];
        const id = createDoubleIdentification(m.clientId, m.partnerId);
        const chat = g_clientActiveChats[id]?.getValue();
        const partnerName = chat ? chat.partnerProfile.name : "no partner name found";
        newState.unshift(
          <ChatPastAction
            onClick={() => {
              const chatIndex = this.state.chatIds.findIndex((i) => i === id);
              if (chatIndex === -1) {
                log.error(new StackTrace(), `Chat with id ${id} is not found`);
                return;
              }
              const page = Math.floor(chatIndex / this.cachedSpaces) + 1;
              o_currentObservedChat.next(chat.partnerId);
              this.setState({ currentPage: page });
            }}
            partnerName={partnerName}
            message={m}
          />
        );
        if (newState.length > 50) {
          newState.length = 50;
        }
        return { pastActions: newState };
      });
    },
  });
  componentWillUnmount() {
    this.newMessageSubscription.unsubscribe();
  }
  cachedSpaces = 0;
  public render() {
    const { chatIds, currentPage, pastActions } = this.state;
    const { chatContainers, spaces } = this.getChatContainers();
    this.cachedSpaces = spaces;
    return (
      <Layout style={{ position: "absolute", width: "100%", height: "100%" }}>
        <Content>{chatContainers}</Content>
        <Footer
          style={{
            background: "#1890ff",
            textAlign: "left",
            display: "flex",
            margin: 0,
            lineHeight: 5,
            padding: "0.5vh",
            height: "7%",
            alignItems: "center",
          }}
        >
          <Pagination
            style={{ display: "inline", float: "left", width: "15%" }}
            key={currentPage}
            defaultCurrent={currentPage}
            onChange={this.handlePageChange}
            simple
            total={chatIds.length}
            defaultPageSize={spaces}
          >
            Hello
          </Pagination>
          <section
            id="chat-past-actions"
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              margin: 0,
              width: "100%",
              height: "100%",
              background: "white",
              overflowX: "auto",
            }}
          >
            {pastActions}
          </section>
        </Footer>
      </Layout>
    );
  }
}

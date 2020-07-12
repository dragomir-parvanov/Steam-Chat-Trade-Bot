import * as React from "react";
import { SteamId64 } from "../../../../models/types/SteamId64";
import { Layout, Button, Input, List, Popover, Divider, Modal } from "antd";
import createDoubleIdentification from "../../../../functions/doubleIdentification";
import LogError from "../../../../classes/errors/base/LogError";
import d_rxjsStateMap from "../../../functions/decorators/d_rxjsStateMap";
import g_chatMessagesJSX from "../../../globals/g_chatMessagesJSX";
import ItemList from "../../common/ItemList";
import g_clientActiveChats from "../../../globals/g_clientActiveChats";
import { EInventoryGetStatus } from "../../../../models/enums/EInventoryGetStatus";
import _ from "lodash";
import ClientActiveChatModel from "../../../models/ClientActiveChat";
import Title from "antd/lib/typography/Title";
import TradeWindow from "../../common/TradeWindow";
import isNullOrUndefined from "../../../../functions/isNullOrUndefined";
import { EPersonaState } from "../../../../declarations/steam-user/EPersonaState";
import ParsedItemWithSellInformationModel from "../../../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import g_clientInventoriesWithSellInformation from "../../../globals/g_clientInventoriesWithSellInformation";
import CloseChatModal from "./CloseChatModal";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import o_currentObservedChat from "../../../globals/observables/o_currentObservedChat";
import { Subscription } from "rxjs";
import SendTradeOfferModel from "../../../../models/models/steam/steam-offers/SendTradeOfferModel";
import tradeOfferModalDefaultProps from "../../../styles/jsx/tradeOfferModalDefaultProps";

export interface SmallChatProps {
  clientId: SteamId64;
  partnerId: SteamId64;
}

export interface SmallChatState {
  chat: ClientActiveChatModel;
  newMessages: JSX.Element[];
  clientInventory: ParsedItemWithSellInformationModel[];
  isTradeOfferModalOpened: boolean;
  inputMessageValue: string;
  isCloseChatModalOpened: boolean;
  isChatObserved: boolean;
}

const { Header, Footer, Sider, Content } = Layout;

@d_rxjsStateMap<SmallChatState, SmallChatProps>({
  chat: (props) => {
    const { clientId, partnerId } = props;

    const id = createDoubleIdentification(clientId, partnerId);
    const subject = g_clientActiveChats[id];
    if (!subject) {
      throw new LogError(`Chat with id ${id} is not found`);
    }
    return subject;
  },
  newMessages: (props) => {
    const { clientId, partnerId } = props;

    const id = createDoubleIdentification(clientId, partnerId);
    const subject = g_chatMessagesJSX[id]?.new;
    if (!subject) {
      throw new LogError(`Messages with id ${id} is not found`);
    }
    return subject;
  },
  clientInventory: (props) => {
    const { clientId } = props;
    const subject = g_clientInventoriesWithSellInformation[clientId];
    if (!subject) {
      throw new LogError(`Inventory with ${clientId} is not found`);
    }

    return subject;
  },
})
export default class SmallChat extends React.Component<SmallChatProps, SmallChatState> {
  constructor(props: SmallChatProps) {
    super(props);
    this.state = { inputMessageValue: "", isCloseChatModalOpened: false, isChatChecked: false, isChatObserved: false } as never;
    console.log("constructor called");
  }
  subscription?: Subscription;
  componentDidMount = () => {
    this.subscription = o_currentObservedChat.subscribe({ next: (id) => this.setState({ isChatObserved: id === this.props.partnerId }) });
  };
  componentWillUnmount() {
    this.subscription?.unsubscribe();
  }
  componentDidUpdate = (prevProps, prevState: SmallChatState) => {
    if (this.state.newMessages !== prevState.newMessages) {
      console.log("should bring it down");
      const { messagesEnd } = this;
      if (messagesEnd) {
        messagesEnd.scrollIntoView({ behavior: "auto" });
      }
    }
  };
  getPartnerProfilePopoverContent = () => {
    const { chat } = this.state;
    const { location, name, vacBanned, memberSince } = chat.partnerProfile;
    const { canTrade, escrowDays } = chat.tradingInformation;

    return (
      <List size="small" style={{ height: "20vh", overflowY: "scroll" }}>
        <List.Item onClick={() => window.open("https://steamcommunity.com/profiles/" + chat.partnerId, "_blank")}>
          <a>{name}</a>
        </List.Item>
        <List.Item>Can trade:{canTrade ? "Yes" : "No"}</List.Item>
        <List.Item>Escrow days:{!isNullOrUndefined(escrowDays) ? escrowDays : " Unknown"}</List.Item>
        {memberSince ? <List.Item>Member since:{memberSince.toLocaleDateString()}</List.Item> : null}
        {location ? <List.Item>Location:{location}</List.Item> : null}
        {vacBanned ? <List.Item style={{ background: "red" }}>Vac banned</List.Item> : null}
        <List.Item>Client:</List.Item>
        <List.Item onClick={() => window.open("https://steamcommunity.com/profiles/" + chat.clientId)}>
          <a>{chat.clientId}</a>
        </List.Item>
      </List>
    );
  };

  getPartnerInventoryPopoverContent = () => {
    const { partnerInventory } = this.state.chat;

    if (partnerInventory.getStatus !== EInventoryGetStatus.Ok) {
      return (
        <List>
          <List.Item>Couldnt't get partner inventory</List.Item>
          <List.Item>Reason:{_.startCase(EInventoryGetStatus[partnerInventory.getStatus])}</List.Item>
          <List.Item>Additional message:{partnerInventory.errorMessage}</List.Item>
        </List>
      );
    }
    const { items } = partnerInventory;
    if (items.length === 0) {
      return <p>No items</p>;
    }
    const tradableItems = partnerInventory.items.filter((i) => i.isTradable);
    const notTradableItems = partnerInventory.items.filter((i) => !i.isTradable);
    return (
      <List size="small" style={{ overflowY: "scroll", maxHeight: "30vh" }}>
        <ItemList items={tradableItems} shouldApplySteamMarketFee calculatePriceBy="lowestPrice" />

        {(() => {
          if (notTradableItems.length < 1) {
            return null;
          }

          return [
            <List.Item>
              <Title level={4}>Not tradable items</Title>
            </List.Item>,
            <ItemList items={notTradableItems} calculatePriceBy="lowestPrice" />,
          ];
        })()}
      </List>
    );
  };
  handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!this.state.inputMessageValue) {
      return;
    }
    const { clientId, partnerId } = this.props;
    let value = event.currentTarget.value;
    mainConnect.chats.messages.sendMessage(clientId, partnerId, value);
    this.setState({ inputMessageValue: "" });
  };
  messagesEnd: HTMLElement | null = null;
  handleChatClick = () => {
    const { clientId, partnerId } = this.props;
    const id = createDoubleIdentification(clientId, partnerId);
    const chat = g_clientActiveChats[id];
    o_currentObservedChat.next(partnerId);
    chat.update((c) => ({ ...c, isChecked: true }));
  };
  handleTradeWindowOnFinish = (request: SendTradeOfferModel) => {
    this.setState({ isTradeOfferModalOpened: false });
    mainConnect.chats.messages.sendTradeOffer(request);
  };
  public render() {
    const { clientId, partnerId } = this.props;
    const { chat, isTradeOfferModalOpened, newMessages, clientInventory, inputMessageValue, isCloseChatModalOpened, isChatObserved } = this.state;
    if (!chat) {
      return <div>Chat not loaded</div>;
    }
    const id = createDoubleIdentification(clientId, partnerId);
    if (!chat.isActive) {
      return <Button onClick={() => this.setState(({ chat }) => ({ chat: { ...chat, isActive: true } }))}>Not active</Button>;
    }
    let borderStyle = (() => {
      if (isChatObserved) {
        return "solid black";
      } else if (chat.isChecked) {
        return "none";
      } else {
        return "solid blue;";
      }
    })();
    // if we remove that, border doesn't work
    if (!chat.isChecked && !isChatObserved) {
      borderStyle = "solid #1890ff";
    }
    console.log("border style", borderStyle);
    return (
      <Layout onClick={this.handleChatClick} style={{ width: "100%", height: "100%", outline: borderStyle }}>
        <CloseChatModal
          clientId={clientId}
          partnerId={partnerId}
          visible={isCloseChatModalOpened}
          onCancel={() => this.setState({ isCloseChatModalOpened: false })}
        />
        <Header style={{ height: "10%", lineHeight: 0, textAlign: "start", padding: 0, margin: 0 }}>
          <Popover destroyTooltipOnHide trigger="click" content={this.getPartnerProfilePopoverContent()}>
            <Button style={{ padding: 0, height: "100%", width: "14%", ...(chat.partnerProfile.vacBanned ? { background: "red" } : {}) }}>P</Button>
          </Popover>
          <Popover destroyTooltipOnHide trigger="click" content={this.getPartnerInventoryPopoverContent()}>
            <Button style={{ padding: 0, height: "100%", width: "14%" }}>I</Button>
          </Popover>

          <Button style={{ padding: 0, height: "100%", width: "44%" }}>{EPersonaState[chat.personaState]}</Button>
          <Button
            onClick={() => this.setState({ isTradeOfferModalOpened: true })}
            style={{ padding: 0, height: "100%", width: "14%", ...(!chat.tradingInformation.canTrade ? { background: "red" } : {}) }}
          >
            T
          </Button>

          <Button style={{ padding: 0, height: "100%", width: "14%" }} onClick={() => this.setState({ isCloseChatModalOpened: true })}>
            X
          </Button>
        </Header>
        <Content
          style={{
            height: "80%",
            maxHeight: "80%",
            overflowY: "scroll",
            overflowX: "hidden",
            boxSizing: "border-box",
            wordWrap: "break-word",
          }}
        >
          {g_chatMessagesJSX[id].previous}
          {newMessages}
          <div
            key={createDoubleIdentification(chat.clientId, chat.partnerId) + "messages-scroll-to-bottom"}
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.messagesEnd = el;
            }}
          ></div>
        </Content>
        <Footer style={{ height: "10%", lineHeight: 0, textAlign: "start", padding: 0, margin: 0 }}>
          <Input
            onPressEnter={this.handleEnterPress}
            onChange={(v) => this.setState({ inputMessageValue: v.target.value })}
            value={inputMessageValue}
            style={{ padding: 0, height: "100%", width: "100%" }}
          ></Input>
        </Footer>
        <Modal
          {...tradeOfferModalDefaultProps}
          key={`${id}-trade-modal`}
          visible={isTradeOfferModalOpened}
          onCancel={() => this.setState({ isTradeOfferModalOpened: false })}
        >
          <TradeWindow
            onFinish={(r) => this.handleTradeWindowOnFinish(r)}
            escrowDays={chat.tradingInformation.escrowDays}
            clientId={chat.clientId}
            partnerId={chat.partnerId}
            clientItems={clientInventory}
            partnerItems={chat.partnerInventory.items}
          />
        </Modal>
      </Layout>
    );
  }
}

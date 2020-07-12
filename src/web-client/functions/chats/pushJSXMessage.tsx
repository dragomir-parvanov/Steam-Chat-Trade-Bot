import g_chatMessagesJSX from "../../globals/g_chatMessagesJSX";
import { Divider, Button, Typography, Modal } from "antd";
import React, { useState } from "react";
import HOURS_BEFORE_CHAT_IS_STALE from "../../models/contstants/HOURS_BEFORE_CHAT_IS_STALE";
import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import ESteamChatMessageType from "../../../models/enums/ESteamChatMessageType";
import _ from "lodash";
import Title from "antd/lib/typography/Title";
import Axios from "axios";
import TradeOfferModel from "../../../models/models/steam/steam-offers/TradeOfferModel";
import SeeTradeOfferModal from "../../components/common/SeeTradeOfferModal";
import g_cachedTradeOffers from "../../globals/g_cachedTradeOffers";
import LogError from "../../../classes/errors/base/LogError";
export default function pushJSXMessage(id: string, newMessage: SteamChatMessageModel, previousMessage?: SteamChatMessageModel, isNewMessage?: boolean) {
  let update: JSX.Element[] = [];
  if (!isNewMessage) {
    if (previousMessage) {
      const time = new Date();
      if (previousMessage.addedOn > time) {
        const divider = createChatMessageDivider(new Date().toLocaleDateString());
        update.push(divider);
      }
    }
    update.push(createJSXMessage(newMessage));
    g_chatMessagesJSX[id].previous.push(...update);
  } else {
    if (!previousMessage) {
      update.push(createChatMessageDivider("Loaded from here"));
    } else {
      const time = new Date();
      time.setHours(time.getHours() + HOURS_BEFORE_CHAT_IS_STALE);
      if (previousMessage.addedOn > time) {
        const divider = createChatMessageDivider(new Date().toLocaleDateString());
        update.push(divider);
      }
    }
    update.push(createJSXMessage(newMessage));
    g_chatMessagesJSX[id].new.update((messages) => [...messages, ...update]);
  }
}

export function isOfferType(type: ESteamChatMessageType): boolean {
  if (type <= 11) {
    return true;
  } else {
    return false;
  }
}

export type SeeTradeOfferProps = {
  message: SteamChatMessageModel;
};
export const SeeTradeOfferButton: React.FC<SeeTradeOfferProps> = (props) => {
  const { message } = props;
  const [isOpen, setisOpen] = useState(false);
  const trade = g_cachedTradeOffers[message.value];
  if (!trade) {
    return <div>didn't find a trade with id {message.value}</div>;
  }
  const modal = <SeeTradeOfferModal visible={isOpen} onCancel={() => setisOpen(false)} oldState={message.type as never} trade={trade} />;

  const button = (
    <Button onClick={() => setisOpen(true)} style={{ width: "100%", backgroundColor: getMessageColorByType(message.type) }}>
      See offer
    </Button>
  );
  return (
    <div>
      {button}
      {modal}
    </div>
  );
};

export function getMessageColorByType(type: ESteamChatMessageType): string {
  if (type === ESteamChatMessageType.Accepted) {
    return "green";
  }

  if (type === ESteamChatMessageType.Error) {
    return "red";
  }

  if (type === ESteamChatMessageType.ClientMessage) {
    return "white";
  }

  if (type === ESteamChatMessageType.PartnerMessage) {
    return "#e6e6e6";
  }

  if (type === ESteamChatMessageType.Canceled) {
    return "orange";
  }
  if (type === ESteamChatMessageType.Declined) {
    return "crimson";
  }
  if (type === ESteamChatMessageType.InEscrow) {
    return "Chartreuse";
  }
  if (type === ESteamChatMessageType.InvalidItems) {
    return "pink";
  }
  if (type === ESteamChatMessageType.SystemMessage) {
    return "aqua";
  }
  return "grey";
}
export function createJSXMessage(message: SteamChatMessageModel): JSX.Element {
  let secondText: JSX.Element;
  const backgroundColor = getMessageColorByType(message.type);
  if (isOfferType(message.type)) {
    // for some reason, we might receive null instead of 0, maybe IPC issue?
    if (message.type === ESteamChatMessageType.JustCreated || message.type == null) {
      secondText = <Typography style={{ background: "white", color: "black" }}>Offer just got created</Typography>;
    } else {
      secondText = <SeeTradeOfferButton message={message} />;
    }
  } else {
    secondText = <Typography>{message.value}</Typography>;
  }
  return (
    <div style={{ backgroundColor }}>
      <Title level={4}>{_.startCase(ESteamChatMessageType[message.type])}:</Title>
      <Typography>{secondText}</Typography>
    </div>
  );
}
export function createChatMessageDivider(text: string): JSX.Element {
  return (
    <Divider plain style={{ width: "30px", height: "10px", lineHeight: 0, position: "relative" }}>
      {text}
    </Divider>
  );
}

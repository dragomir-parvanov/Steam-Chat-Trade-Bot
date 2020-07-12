import * as React from "react";
import SteamChatMessageModel from "../../../../models/models/chats/SteamChatMessageModel";
import { getMessageColorByType, isOfferType, createJSXMessage } from "../../../functions/chats/pushJSXMessage";
import _ from "lodash";
import { Typography, Popover } from "antd";
import ESteamChatMessageType from "../../../../models/enums/ESteamChatMessageType";

export interface ChatPastActionProps {
  message: SteamChatMessageModel;
  partnerName: string;
  onClick: () => void;
}

export interface ChatPastActionState {}

export default class ChatPastAction extends React.Component<ChatPastActionProps, ChatPastActionState> {
  constructor(props: ChatPastActionProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { clientId, partnerId, type, value } = this.props.message;
    const { partnerName, onClick } = this.props;
    const text = isOfferType(type) ? _.startCase(ESteamChatMessageType[type]) : value;
    const popoverContent = createJSXMessage(this.props.message);
    return (
      <div onClick={onClick} style={{ background: getMessageColorByType(type), overflow: "hidden", border: "solid black", maxWidth: "20%" }}>
        <Popover title={null} content={popoverContent} style={{ margin: 0, padding: 0 }}>
          <Typography>
            {partnerName}:{text}
          </Typography>
        </Popover>
      </div>
    );
  }
}

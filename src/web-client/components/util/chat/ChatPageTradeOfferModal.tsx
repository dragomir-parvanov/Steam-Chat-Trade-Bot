import * as React from "react";
import d_rxjsStateMap from "../../../functions/decorators/d_rxjsStateMap";
import o_currentUser from "../../../globals/observables/o_currentUser";
import o_currentTradeOfferSeeId from "../../../globals/observables/o_currentTradeOfferSeeId";
import { Modal } from "antd";

export interface ChatPageTradeOfferModalProps {}

export interface ChatPageTradeOfferModalState {
  currentTradeOfferId: string;
}

@d_rxjsStateMap<ChatPageTradeOfferModalState>({ currentTradeOfferId: o_currentTradeOfferSeeId })
export default class ChatPageTradeOfferModal extends React.Component<ChatPageTradeOfferModalProps, ChatPageTradeOfferModalState> {
  constructor(props: ChatPageTradeOfferModalProps) {
    super(props);
  }

  public render() {
    return <Modal destroyOnClose>Hello</Modal>;
  }
}

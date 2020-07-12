import * as React from "react";
import TradeOfferModel from "../../../models/models/steam/steam-offers/TradeOfferModel";
import { Modal, Row, Col, List } from "antd";
import Item from "antd/lib/list/Item";
import ItemList from "./ItemList";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import Grid from "antd/lib/card/Grid";
import flooring from "../../../functions/flooring";
import calculateClientItemsSum from "../../../business-logic/functions/calculateClientItemsSum";
import calculatePartnerItemsSum from "../../../business-logic/functions/calculatePartnerItemsSum";

export interface SeeTradeOfferModalProps {
  trade: TradeOfferModel;
  onCancel: () => void;
  visible: boolean;
  oldState: ETradeOfferState;
}

export interface SeeTradeOfferModalState {
  visible: boolean;
}
const listStyle: React.CSSProperties = { overflowY: "scroll", maxHeight: "80vh" };
export default class SeeTradeOfferModal extends React.Component<SeeTradeOfferModalProps, SeeTradeOfferModalState> {
  constructor(props: SeeTradeOfferModalProps) {
    super(props);

    this.state = { visible: props.visible };
  }
  componentWillReceiveProps = (props: SeeTradeOfferModalProps) => {
    if (props.visible !== this.state.visible) {
      this.setState({ visible: props.visible });
    }
  };
  public render() {
    const { onCancel, trade, oldState } = this.props;
    const { visible } = this.state;

    const clientItemsInTradeSum = calculateClientItemsSum(trade.itemsToGive);
    const partnerItemsInTradeSum = calculatePartnerItemsSum(trade.itemsToReceive);

    const tradeProfit = trade.profit;
    return (
      <Modal
        okButtonProps={{
          style: { display: "none" },
        }}
        maskTransitionName={"none"}
        transitionName={"none"}
        bodyStyle={{ minHeight: "70vh", maxHeight: "70vh" }}
        width="70%"
        visible={visible}
        onCancel={() => {
          console.log("cancel in SeeTradeOfferModal");
          this.setState({ visible: false });
          onCancel();
        }}
      >
        <div style={{ width: "100%" }}>
          <Row>
            <Col className="gutter-row" span={12}>
              Our items:{clientItemsInTradeSum}
            </Col>
            <Col className="gutter-row" span={12}>
              Partner items:{partnerItemsInTradeSum}
            </Col>
          </Row>
          <Row>
            <Col style={{ border: "solid black" }} className="gutter-row" span={12}>
              <List style={listStyle}>
                <ItemList calculatePriceBy="averagePrice" shouldCalculateApplyings items={trade.itemsToGive} />
              </List>
            </Col>
            <Col style={{ border: "solid black" }} className="gutter-row" span={12}>
              <List style={listStyle}>
                <ItemList calculatePriceBy="lowestPrice" shouldApplySteamMarketFee items={trade.itemsToReceive} />
              </List>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={12}>
              New state: {ETradeOfferState[trade.state]} Old state: {ETradeOfferState[oldState]} Made by: {trade.madeByWorker}
            </Col>
            <Col className="gutter-row" span={12}>
              Profit:{tradeProfit}
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

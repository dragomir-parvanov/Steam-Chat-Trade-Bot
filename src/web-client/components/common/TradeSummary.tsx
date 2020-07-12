import * as React from "react";
import { Row, Col, Grid } from "antd";
import { getMessageColorByType } from "../../functions/chats/pushJSXMessage";
import ESteamChatMessageType from "../../../models/enums/ESteamChatMessageType";
import TradesSummaryResponseModel from "../../../shared-network/models/web/responses/TradesSummaryResponseModel";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import _ from "lodash";
import RecordFunctions from "../../../classes/RecordFunctions";
import asUniqueArray from "../../../models/types/UniqueArray";

export interface TradeSummaryProps {
  summary: TradesSummaryResponseModel;
}

export interface TradeSummaryState {}
const rowStyle: React.CSSProperties = { lineHeight: 3 };
export default class TradeSummary extends React.Component<TradeSummaryProps, TradeSummaryState> {
  constructor(props: TradeSummaryProps) {
    super(props);

    this.state = {};
  }

  public render() {
    const { summary } = this.props;
    const summaryJSX: JSX.Element[] = [];
    let totalSentOffersCount = 0;
    let totalProfitSum = 0;
    RecordFunctions.forEach(summary, (s) => (totalSentOffersCount += s.count));
    RecordFunctions.forEach(summary, (s) => {
      if (s._id === ETradeOfferState.Accepted || s._id === ETradeOfferState.InEscrow) totalProfitSum += s.sum;
    });
    const cols = Object.values(summary).map((s) => (
      <Col span={6} style={{ background: getMessageColorByType(s._id as any) }}>
        {_.startCase(ETradeOfferState[s._id])} count:{s.count} sum:{s.sum}
      </Col>
    ));
    for (let i = 0; i < cols.length; i += 2) {
      summaryJSX.push(
        <Row style={rowStyle} className="gutter-row">
          {cols[i]}
          {cols[i + 1]}
        </Row>
      );
    }
    return (
      <div>
        <Row className="gutter-row">
          <Col span={6}>Total sent offers:{totalSentOffersCount}</Col>
          <Col span={6}>Total profit +escrow:{totalProfitSum}</Col>
        </Row>
        {summaryJSX}
      </div>
    );
  }
}

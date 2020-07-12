import * as React from "react";
import { SteamId64 } from "../../../models/types/SteamId64";
import ParsedItemWithSellInformationModel from "../../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import { Layout, Col, Row, List, Divider, Button, Space } from "antd";
import ItemList from "./ItemList";
import LogError from "../../../classes/errors/base/LogError";
import _ from "lodash";
import SendTradeOfferModel, { ItemsTradeOfferDirectiveModel } from "../../../models/models/steam/steam-offers/SendTradeOfferModel";
import createItemsTradeOfferDirective from "../../functions/chats/items/createItemsTradeOfferDirective";
import calculateTradeOfferProfit from "../../../business-logic/functions/calculateTradeOfferProfit";
import flooring from "../../../functions/flooring";
import calculateClientItemsSum from "../../../business-logic/functions/calculateClientItemsSum";
import calculatePartnerItemsSum from "../../../business-logic/functions/calculatePartnerItemsSum";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";

const listStyle: React.CSSProperties = { overflowY: "scroll", maxHeight: "80vh" };
export interface TradeWindowProps {
  clientId: SteamId64;
  partnerId: SteamId64;
  clientItems: ParsedItemWithSellInformationModel[];
  partnerItems: ParsedItemWithSellInformationModel[];
  onFinish: (request: SendTradeOfferModel) => void;
  escrowDays?: number;
}

export interface TradeWindowState {
  clientItems: ParsedItemWithSellInformationModel[];
  clientItemsInTrade: ParsedItemWithSellInformationModel[];
  partnerItems: ParsedItemWithSellInformationModel[];
  partnerItemsInTrade: ParsedItemWithSellInformationModel[];
}
const { Header, Footer } = Layout;
export default class TradeWindow extends React.Component<TradeWindowProps, TradeWindowState> {
  constructor(props: TradeWindowProps) {
    super(props);
    this.initializeMovingHandler.bind(this);

    this.state = { clientItems: [...props.clientItems], partnerItems: [...props.partnerItems], clientItemsInTrade: [], partnerItemsInTrade: [] };
  }
  componentWillReceiveProps = (props: TradeWindowProps) => {
    if (this.props.clientItems === props.clientItems && this.props.partnerItems === props.partnerItems) {
      return;
    }
    const newState = { ...props, partnerItemsInTrade: [], clientItemsInTrade: [] };
    this.setState(newState);
  };
  initializeMovingHandler<T extends keyof TradeWindowState>(from: T, to: T) {
    if (from === to) {
      throw new LogError("From and to cannot be the same");
    }

    return (i: ParsedItemWithSellInformationModel) => {
      this.setState((prevState) => {
        const newFrom = [...prevState[from]].filter((i2) => i.assetId !== i2.assetId);
        const newTo = [...prevState[to], i];
        return {
          [from]: newFrom,
          [to]: newTo,
        } as any;
      });
    };
  }

  public render() {
    console.log("Trade window init");

    const { escrowDays } = this.props;
    const { clientItems, clientItemsInTrade, partnerItems, partnerItemsInTrade } = this.state;
    const [clientItemsTradable, clientItemsNotTradable] = _.partition(clientItems, (i) => i.isTradable);
    const [partnerItemsTradable, partnerItemsNotTradable] = _.partition(partnerItems, (i) => i.isTradable);
    const clientItemsSumPrice = flooring(clientItemsTradable.reduce((acc, i) => acc + i.averagePrice + i.applyingsPrice, 0));
    const partnerItemsSumPrice = flooring(partnerItemsTradable.reduce((acc, i) => acc + i.lowestPrice + i.applyingsPrice, 0));

    const clientItemsInTradeSum = calculateClientItemsSum(clientItemsInTrade);
    const partnerItemsInTradeSum = calculatePartnerItemsSum(partnerItemsInTrade);

    const tradeProfit = calculateTradeOfferProfit(clientItemsInTrade, partnerItemsInTrade);
    return (
      <div style={{ width: "100%" }}>
        <Row style={{ border: "solid black" }}>
          <Col className="gutter-row" span={6}>
            Our items:{clientItemsSumPrice}
          </Col>
          <Col className="gutter-row" span={6}>
            Our items in trade:{clientItemsInTradeSum}
          </Col>
          <Col className="gutter-row" span={6}>
            Partner items in trade:{partnerItemsInTradeSum}
          </Col>
          <Col key={partnerItemsSumPrice} className="gutter-row" span={6}>
            Partner items:{partnerItemsSumPrice}
          </Col>
        </Row>
        <Row style={{ border: "solid black" }}>
          <Col style={{ border: "solid black" }} className="gutter-row" span={6}>
            <List style={listStyle}>
              <ItemList
                tradeModeHandler={{ onItemClick: this.initializeMovingHandler("clientItems", "clientItemsInTrade") }}
                items={clientItemsTradable}
                calculatePriceBy="averagePrice"
              />
              <Divider>Not tradable</Divider>
              <ItemList items={clientItemsNotTradable} calculatePriceBy="averagePrice" />
            </List>
          </Col>
          <Col style={{ border: "solid black" }} className="gutter-row" span={6}>
            <List style={listStyle}>
              <ItemList
                tradeModeHandler={{ onItemClick: this.initializeMovingHandler("clientItemsInTrade", "clientItems") }}
                items={clientItemsInTrade}
                calculatePriceBy="averagePrice"
              />
            </List>
          </Col>
          <Col style={{ border: "solid black" }} className="gutter-row" span={6}>
            <List style={listStyle}>
              <ItemList
                shouldApplySteamMarketFee
                tradeModeHandler={{ onItemClick: this.initializeMovingHandler("partnerItemsInTrade", "partnerItems") }}
                items={partnerItemsInTrade}
                calculatePriceBy="lowestPrice"
              />
            </List>
          </Col>
          <Col style={{ border: "solid black" }} className="gutter-row" span={6}>
            <List style={listStyle}>
              <ItemList
                shouldApplySteamMarketFee
                shouldCalculateApplyings
                tradeModeHandler={{ onItemClick: this.initializeMovingHandler("partnerItems", "partnerItemsInTrade") }}
                items={partnerItemsTradable}
                calculatePriceBy="lowestPrice"
              />

              <Divider>Not tradable</Divider>
              <ItemList shouldApplySteamMarketFee shouldCalculateApplyings items={partnerItemsNotTradable} calculatePriceBy="lowestPrice" />
            </List>
          </Col>
        </Row>
        <Row>
          <Col className="gutter-row" span={6}>
            Escrow days:{escrowDays}
          </Col>
          <Col className="gutter-row" span={12}>
            Trade offer profit:{tradeProfit}
          </Col>
          <Col className="gutter-row" span={6}>
            <Space>
              <Button onClick={this.handleSendOfferButtonClick} type="primary">
                Send offer
              </Button>
              <Button disabled type="primary">
                Send offer with message
              </Button>
            </Space>
          </Col>
        </Row>
      </div>
    );
  }

  handleSendOfferButtonClick = () => {
    const { clientId, partnerId, onFinish } = this.props;

    const { clientItemsInTrade, partnerItemsInTrade } = this.state;

    if (clientItemsInTrade.length === 0 && partnerItemsInTrade.length === 0) {
      return;
    }

    const client = createItemsTradeOfferDirective(clientItemsInTrade);
    const partner = createItemsTradeOfferDirective(partnerItemsInTrade);

    const request: SendTradeOfferModel = {
      clientId,
      partnerId,
      client,
      partner,
    };

    onFinish(request);
  };
}

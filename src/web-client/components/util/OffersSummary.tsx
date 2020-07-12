import * as React from "react";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";
import TradeSummary from "../common/TradeSummary";
import Title from "antd/lib/typography/Title";
import { Row, Col, Select, Typography, DatePicker } from "antd";
import getTime from "../../../functions/time/getTime";
import o_currentUser from "../../globals/observables/o_currentUser";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import d_rxjsStateMap from "../../functions/decorators/d_rxjsStateMap";
import isUserAdmin from "../../../main-server/src/passport/isUserAdmin";
import d_isUserLogged from "../../functions/decorators/d_isUserLogged";

export interface OffersSummaryProps {}

export interface OffersSummaryState {
  currentUser: RegisteredUserModel | null;
  lastHourSummary: JSX.Element | null;
  last3HoursSummary: JSX.Element | null;
  last6HoursSummary: JSX.Element | null;
  lastWeekSummary: JSX.Element | null;
  fromLastPaymentSummary: JSX.Element | null;
  totalSummary: JSX.Element | null;
  customSummary: JSX.Element | null;
  currentObservedUsers: [];
  workerNames: string[];
  pickedWorkerNames: string[];
}
@d_isUserLogged()
@d_rxjsStateMap<OffersSummaryState>({ currentUser: o_currentUser })
export default class OffersSummary extends React.Component<OffersSummaryProps, OffersSummaryState> {
  constructor(props: OffersSummaryProps) {
    super(props);
    this.state = {
      lastHourSummary: null,
      last3HoursSummary: null,
      last6HoursSummary: null,
      lastWeekSummary: null,
      fromLastPaymentSummary: null,
      totalSummary: null,
      customSummary: null,
      currentUser: null,
      currentObservedUsers: [],
      workerNames: [],
      pickedWorkerNames: [],
    };
  }

  componentDidMount = () => {
    this.fetchSummaries();
    mainConnect.auth.management.getWorkerNames().then((r) => this.setState({ workerNames: r }));
  };
  fetchSummaries = () => {
    const now = new Date().getTime();
    const { pickedWorkerNames } = this.state;
    mainConnect.items.offers
      .getOffersSummary(now - getTime(1, "hours"), now, pickedWorkerNames)
      .then((s) => this.setState({ lastHourSummary: <TradeSummary summary={s} /> }));
    mainConnect.items.offers
      .getOffersSummary(now - getTime(3, "hours"), now, pickedWorkerNames)
      .then((s) => this.setState({ last3HoursSummary: <TradeSummary summary={s} /> }));
    mainConnect.items.offers
      .getOffersSummary(now - getTime(6, "hours"), now, pickedWorkerNames)
      .then((s) => this.setState({ last6HoursSummary: <TradeSummary summary={s} /> }));
    mainConnect.items.offers
      .getOffersSummary(now - getTime(1, "weeks"), now, pickedWorkerNames)
      .then((s) => this.setState({ lastWeekSummary: <TradeSummary summary={s} /> }));
    const registeredOnTime = new Date(o_currentUser.getValue()?.registeredOn || 1).getTime();
    mainConnect.items.offers
      .getOffersSummary(registeredOnTime, now, pickedWorkerNames)
      .then((s) => this.setState({ totalSummary: <TradeSummary summary={s} /> }));
  };
  componentDidUpdate(prevProps, prevState: OffersSummaryState) {
    if (prevState.pickedWorkerNames !== this.state.pickedWorkerNames) {
      this.fetchSummaries();
    }
  }
  public render() {
    const {
      currentUser,
      last3HoursSummary,
      last6HoursSummary,
      lastHourSummary,
      lastWeekSummary,
      fromLastPaymentSummary,
      totalSummary,
      workerNames,
      customSummary,
      pickedWorkerNames,
    } = this.state;
    return (
      <div>
        {(() => {
          if (!isUserAdmin(currentUser)) {
            return null;
          }
          if (!workerNames) {
            return null;
          }

          return [
            <Typography>Select worker</Typography>,
            <Select
              style={{ minWidth: 300 }}
              mode="multiple"
              onChange={(workers) => this.setState({ pickedWorkerNames: workers as any })}
              options={workerNames.map((n) => ({ value: n, key: n }))}
            />,
          ];
        })()}
        <Row>
          <Col span={12}>
            <Title>Last hour summary.</Title>
            {lastHourSummary}
            <Title>Last 3 hours summary.</Title>
            {last3HoursSummary}
            <Title>Last 6 hours summary.</Title>
            {last6HoursSummary}
          </Col>
          <Col span={12}>
            <Title>Last week summary.</Title>
            {lastWeekSummary}
            <Title>Custom summary.</Title>
            <DatePicker.RangePicker
              onCalendarChange={async (dates) => {
                const summary = await mainConnect.items.offers.getOffersSummary(
                  dates?.[0]?.toDate().getTime() || 1,
                  dates?.[1]?.toDate().getTime() ?? new Date().getTime(),
                  pickedWorkerNames
                );
                this.setState({ customSummary: <TradeSummary summary={summary} /> });
              }}
            ></DatePicker.RangePicker>
            {customSummary}
            <Title>Total summary</Title>
            {totalSummary}
          </Col>
        </Row>
      </div>
    );
  }
}

import * as React from "react";
import d_isUserLogged from "../../functions/decorators/d_isUserLogged";
import { Table, Typography, Popover, Select, DatePicker, Pagination, Button } from "antd";
import TradeOfferModel from "../../../models/models/steam/steam-offers/TradeOfferModel";
import mainConnect from "../../../shared-network/express-function-router/implementations/mainConnect";

import TradeOffersQueryRequestModel from "../../../shared-network/models/web/requests/TradeOffersQueryRequestModel";

import { ETradeOfferState } from "steam-tradeoffer-manager";
import _ from "lodash";
import { getMessageColorByType } from "../../functions/chats/pushJSXMessage";
import enumMembersToString from "../../../functions/enumFunctions";

import SeeTradeOfferModal from "../common/SeeTradeOfferModal";
import SortQueryType from "../../../data/models/SortQueryType";
import { ColumnsType } from "antd/lib/table";

export interface TradesTableProps {}

export interface TradesTableState {
  trades: { total: number; value: TradeOfferModel[] };
  query: TradeOffersQueryRequestModel;
  isLoading: boolean;
  isDateRangePopoverOpened: boolean;
  currentOservedTrade?: { isVisible: boolean; trade: TradeOfferModel };
}

const afterDate = new Date();
afterDate.setDate(afterDate.getDate() - 7);

@d_isUserLogged()
export default class TradesTable extends React.Component<TradesTableProps, TradesTableState> {
  constructor(props: TradesTableProps) {
    super(props);
    this.state = {
      trades: { total: 0, value: [] },
      query: { afterDate: afterDate.getTime(), beforeDate: new Date().getTime(), mongoQuery: {}, page: 1, count: 10, sortQuery: { profit: -1 } },
      isLoading: true,
      isDateRangePopoverOpened: false,
    };
  }

  componentDidMount() {
    this.fetchTrades();
  }
  fetchTrades = () => {
    const { query } = this.state;
    console.log("should get items");
    let cachedCurrentOperation = +this.currentOperation;
    this.setState({ isLoading: true });
    mainConnect.items.offers.getOffersWithQuery(query).then((trades) => {
      if (this.currentOperation !== cachedCurrentOperation) {
        return;
      }
      trades.value.forEach((t) => (t.actedOn = new Date(t.actedOn)));
      // preventing from showing records which are from past axios request
      this.currentOperation++;
      this.setState({ trades, isLoading: false });
    });
  };
  currentOperation = 0;
  componentDidUpdate = (prevProps, prevState: TradesTableState) => {
    if (prevState.query !== this.state.query) {
      this.fetchTrades();
    }
  };

  getStatePopoverContent = () => {
    const handleStateChange = (states: ETradeOfferState[]) => {
      this.setState(({ query }) => {
        const newQuery: typeof query = { ...query, mongoQuery: { ...query.mongoQuery } };

        if (!states.length) {
          delete newQuery.mongoQuery.state;
          return { query: newQuery };
        }

        newQuery.mongoQuery.state = { $in: states.map((s) => ETradeOfferState[s]) as any };

        return { query: newQuery };
      });
    };
    const selectOptions: Select["props"]["options"] = enumMembersToString(ETradeOfferState).map((s) => ({
      value: s,
      key: s,
      style: { background: getMessageColorByType(ETradeOfferState[s] as never) },
    }));
    return <Select mode="multiple" style={{ minWidth: "300px", minHeight: "100px" }} options={selectOptions} onChange={handleStateChange}></Select>;
  };

  getActedOnPopoverContent = () => {
    const { RangePicker } = DatePicker;

    return (
      <RangePicker
        format="DD/MM/YYYY"
        onCalendarChange={(v) => {
          if (!v) {
            this.setState(({ query }) => {
              const newQuery = { ...query };
              newQuery.afterDate = afterDate.getTime();
              newQuery.beforeDate = new Date().getTime();
              return { query: newQuery };
            });
          } else {
            this.setState(({ query }) => {
              const newQuery = { ...query };
              newQuery.afterDate = v[0]?.toDate().getTime() ?? afterDate.getTime();
              newQuery.beforeDate = v[1]?.toDate().getTime() ?? new Date().getTime();

              return { query: newQuery };
            });
          }
        }}
      ></RangePicker>
    );
  };
  handleEntitiesPerPageChange = (count: number) => () =>
    this.setState(({ query }) => {
      const newQuery = { ...query };
      newQuery.count = count;
      return { query: newQuery };
    });
  handleSortingClick = (entity: keyof SortQueryType<TradeOfferModel>) => {
    return () => {
      this.setState(({ query }) => {
        const newQuery = { ...query, sortQuery: { ...query.sortQuery } };
        if (entity in query.sortQuery) {
          newQuery.sortQuery[entity]! *= -1;
        } else {
          newQuery.sortQuery = {};
          newQuery.sortQuery[entity] = 1;
        }
        return { query: newQuery };
      });
    };
  };
  columns: ColumnsType<TradeOfferModel> = [
    {
      key: "state",
      dataIndex: "state",
      render: (state: ETradeOfferState) => (
        <Typography style={{ background: getMessageColorByType(state as never) }}>{ETradeOfferState[state]}</Typography>
      ),
      title: (
        <Popover trigger="onclick" placement="bottom" content={this.getStatePopoverContent()}>
          <Typography>State</Typography>
        </Popover>
      ),
    },
    {
      key: "profit",
      dataIndex: "profit",
      title: <p onClick={this.handleSortingClick("profit")}>Profit</p>,
      render: (profit: number) => profit,
    },
    {
      key: "actedOn",
      dataIndex: "actedOn",
      title: (
        <Popover content={this.getActedOnPopoverContent()} trigger="onclick">
          <Typography>Acted on</Typography>
        </Popover>
      ),
      render: (d: Date) => d.toLocaleDateString(),
    },
    {
      key: "_id",
      dataIndex: "_id",
      title: <Typography>Id</Typography>,
      render: (id: string) => id,
    },
    {
      key: "madeOn",
      dataIndex: "madeOn",
      title: <p onClick={this.handleSortingClick("madeOn")}>Made on</p>,
      render: (id: string) => id,
    },
    {
      key: "madeByWorker",
      dataIndex: "madeByWorker",
      title: <Typography>Made by</Typography>,
      render: (id: string) => id,
    },
    {
      key: "clientId",
      dataIndex: "clientId",
      title: <Typography>Client Id</Typography>,
      render: (id: string) => id,
    },
    {
      key: "partnerId",
      dataIndex: "partnerId",
      title: <Typography>Partner Id</Typography>,
      render: (id: string) => id,
    },
  ];
  public render() {
    const { trades, query, currentOservedTrade, isLoading } = this.state;
    return (
      <div>
        <Button onClick={this.fetchTrades} type="primary">
          Refresh
        </Button>
        {(() => {
          if (currentOservedTrade) {
            const handleCancel = () => {
              this.setState((state) => {
                const newState = state.currentOservedTrade!;

                newState.isVisible = false;
                return { currentOservedTrade: newState };
              });
            };
            return (
              <SeeTradeOfferModal
                trade={currentOservedTrade.trade}
                oldState={currentOservedTrade.trade.state}
                visible={currentOservedTrade.isVisible}
                onCancel={handleCancel}
              />
            );
          }
        })()}
        <Table
          loading={isLoading}
          onRow={(row) => {
            return {
              onClick: () => this.setState({ currentOservedTrade: { trade: row, isVisible: true } }),
            };
          }}
          pagination={false}
          columns={this.columns}
          dataSource={trades.value}
        ></Table>
        <div style={{ display: "flex" }}>
          <Pagination
            simple
            style={{ paddingRight: "3%", marginLeft: "3%" }}
            pageSize={query.count}
            total={trades.total}
            current={query.page}
            onChange={(page) =>
              this.setState(({ query }) => {
                const newQuery = { ...query };
                newQuery.page = page;
                return { query: newQuery };
              })
            }
          />

          <Button onClick={this.handleEntitiesPerPageChange(10)}>10</Button>
          <Button onClick={this.handleEntitiesPerPageChange(20)}>25</Button>
          <Button onClick={this.handleEntitiesPerPageChange(25)}>25</Button>
          <Button onClick={this.handleEntitiesPerPageChange(50)}>50</Button>
        </div>
      </div>
    );
  }
}

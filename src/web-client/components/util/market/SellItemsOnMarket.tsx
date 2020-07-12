import * as React from "react";
import { Layout, Button, Menu, Space, List, Typography, Input, Popconfirm } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import MarketSellListingsModel, { MarketSellListingModel } from "../../../../models/models/steam/steam-market/MarketSellListingsModel";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import g_marketStatus from "../../../../main-server/src/globals/g_marketStatus";
import checkForNoItemsWithPriceSchema from "../../../functions/chats/checkForNoItemsWithPriceSchema";
import MarketSellOrderModel from "../../../../models/models/steam/steam-market/MarketSellOrderModel";
import ItemSellInformationModel from "../../../../models/models/steam/steam-market/ItemSellInformationModel";
import g_itemsPricesSchema from "../../../globals/g_itemsPricesSchema";
import LogError from "../../../../classes/errors/base/LogError";
import { ECurrency } from "../../../../models/enums/ECurrency";
import FormItem from "antd/lib/form/FormItem";
import { createContext, useState } from "react";
import Modal from "antd/lib/modal/Modal";
import MarketSellOrderModal from "./MarketSellOrderModal";
import d_userHasClaim from "../../../functions/decorators/d_userHasClaim";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import generateGUID from "../../../../functions/generateGUID";
import enumMembersToString from "../../../../functions/enumFunctions";
import { rawListeners } from "process";
import { getMarketOrdersHistogramType } from "../../../../main-server/src/functions/childs/market/getMarketOrdersHistogram";

export interface SellItemsOnMarketProps {}

export interface SellItemsOnMarketState {
  marketSellOrders: Record<string, MarketSellOrderModel>;
  marketStatus: typeof g_marketStatus | null;
  marketSellListings: MarketSellListingsModel | null;
  removeListingsBatch: MarketSellListingsModel;
  isCreateModelOpened: boolean;
  currentlyEditedMarketHashName: null | string;
  isLoading: boolean;
  marketOrders: Record<string, getMarketOrdersHistogramType> | null;
}

const { Header, Content, Footer } = Layout;

@d_userHasClaim(ERegisteredUserClaim.MarketManagement)
export default class SellItemsOnMarket extends React.Component<SellItemsOnMarketProps, SellItemsOnMarketState> {
  constructor(props: SellItemsOnMarketProps) {
    super(props);
    this.state = {
      marketSellOrders: {},
      marketStatus: null,
      marketSellListings: null,
      removeListingsBatch: { eur: [], usd: [], rub: [] },
      isCreateModelOpened: false,
      currentlyEditedMarketHashName: null,
      isLoading: true,
      marketOrders: null,
    };
  }

  componentDidMount = async () => {
    mainConnect.market.getMarketStatus().then((s) => this.setState({ marketStatus: s }));
    mainConnect.market
      .getMarketSellOrders()
      .then(async (orders) => {
        const value = Object.values(orders);

        await checkForNoItemsWithPriceSchema(value.map((o) => o._id));

        this.setState({ marketSellOrders: orders });
      })
      .finally(() => this.setState({ isLoading: false }));
  };
  getSellOrders = () => {
    this.setState({ isLoading: true });
    mainConnect.market
      .getAllMarketOrdersHistogramFromSellOrders()
      .then((r) => this.setState({ marketOrders: r }))
      .finally(() => this.setState({ isLoading: false }));
  };
  handleRemoveListingFromBatch = (currency: keyof typeof ECurrency, listing: MarketSellListingModel) => {
    this.setState(({ removeListingsBatch, marketSellListings }) => {
      if (!marketSellListings) {
        return null;
      }
      console.log("handle called", removeListingsBatch, marketSellListings, listing);
      const index = removeListingsBatch[currency].findIndex(
        (l) => l.amount === listing.amount && l.marketHashName === listing.marketHashName && l.price === listing.price
      );

      if (index === -1) {
        return null;
      }

      const newState = { ...removeListingsBatch };
      newState[currency] = [...newState[currency]];
      newState[currency].splice(index, 1);
      console.log(newState[currency]);
      return { removeListingsBatch: newState };
    });
  };
  handleRemoveListingFromListingsButton = (currency: keyof typeof ECurrency, listing: MarketSellListingModel) => {
    this.setState(({ marketSellListings, removeListingsBatch }) => {
      if (!marketSellListings) {
        return null;
      }
      const id = removeListingsBatch[currency].findIndex(
        // maybe hash table can replace this ugly code
        (l) => l.marketHashName === listing.marketHashName && l.amount === listing.amount && l.price === listing.price
      );

      if (id !== -1) {
        throw new LogError(`Cannot add item with ${listing.marketHashName} market hash name to the remove batch.`);
      }

      const newState = { ...removeListingsBatch };

      newState[currency] = [...newState[currency], listing];

      return { removeListingsBatch: newState };
    });
  };
  handleOrderUpdate = async (order: MarketSellOrderModel) => {
    await checkForNoItemsWithPriceSchema([order._id]);
    order._id = order._id.trim();
    mainConnect.market.updateMarketSellOrders({ [order._id]: order }).then(() =>
      this.setState(({ marketSellOrders }) => {
        const newState = { ...marketSellOrders };
        newState[order._id] = order;
        return { marketSellOrders: newState };
      })
    );
    this.setState({ isCreateModelOpened: false, currentlyEditedMarketHashName: null });
  };
  getMarketListings = () => {
    this.setState({ isLoading: true });
    mainConnect.market
      .getAllMarketListings()
      .then((r) => this.setState({ marketSellListings: r }))
      .finally(() => this.setState({ isLoading: false }));
  };
  getColumns = () => {
    const { marketSellListings, removeListingsBatch, currentlyEditedMarketHashName } = this.state;

    /**
     * Ability to remove and add items to to the batch
     * @param currency
     */
    const createListingRenderButtons = (currency: keyof typeof ECurrency) => {
      return (_: any, record: MarketSellOrderModel) => {
        const { marketSellListings, removeListingsBatch } = this.state;
        if (!marketSellListings?.[currency]) {
          return null;
        }
        console.log("batch in render", removeListingsBatch);
        return marketSellListings[currency]
          .filter((l) => l.marketHashName === record._id)
          .map((l) => {
            if (
              removeListingsBatch[currency].some((l2) => l.marketHashName === l2.marketHashName && l.price === l2.price && l.amount === l2.amount)
            ) {
              return (
                <Button
                  type="primary"
                  onClick={() => {
                    this.handleRemoveListingFromBatch(currency, l);
                  }}
                >
                  Amount {l.amount} Price {l.price}
                </Button>
              );
            } else {
              return (
                <Button onClick={() => this.handleRemoveListingFromListingsButton(currency, l)}>
                  Amount {l.amount} Price {l.price}
                </Button>
              );
            }
          });
      };
    };

    const createSellOrdersCell = (currency: keyof typeof ECurrency) => {
      return (_: any, record: MarketSellOrderModel) => {
        const { marketOrders } = this.state;

        const order = marketOrders?.[record._id]?.[currency];
        if (!order) {
          return null;
        }

        return (
          <div style={{ width: 300, height: 100, overflowY: "scroll", wordBreak: "break-all" }}>
            {order.sell_order_graph.map((o) => {
              return [o[2], <br />];
            })}
          </div>
        );
      };
    };
    const columns: ColumnsType<MarketSellOrderModel> = [
      {
        key: "_id",
        dataIndex: "_id",
        title: "Market Hash Name",
        render: (name: string) => <Typography>{name}</Typography>,
      },
      {
        key: "isActive",
        dataIndex: "isActive",
        title: "Is Active",
        render: (bool: boolean) => (bool ? "Yes" : "No"),
      },
      {
        key: "eur",
        dataIndex: "eur",
        render: (eur) => eur,
        title: "EUR Price",
      },
      {
        key: "rub",
        dataIndex: "rub",
        render: (rub) => rub,
        title: "RUB Price",
      },
      {
        key: "usd",
        dataIndex: "usd",
        render: (usd) => usd,
        title: "USD Price",
      },
      {
        key: "eurListings",
        dataIndex: "eurListings",
        render: createListingRenderButtons("eur"),
        title: "EURO Listings",
      },
      {
        key: "rubListings",
        dataIndex: "rubListings",
        render: createListingRenderButtons("rub"),
        title: "RUB Listings",
      },
      {
        key: "usdListings",
        dataIndex: "usdListings",
        render: createListingRenderButtons("usd"),
        title: "USD listings",
      },
      {
        key: "eurOrders",
        dataIndex: "eurOrders",
        render: createSellOrdersCell("eur"),
        title: "EURO Sell Orders",
      },
      {
        key: "usdOrders",
        dataIndex: "usdOrders",
        render: createSellOrdersCell("usd"),
        title: "USD Sell Orders",
      },
      {
        key: "rubOrders",
        dataIndex: "rubOrders",
        render: createSellOrdersCell("rub"),
        title: "RUB Sell Orders",
      },
      {
        key: "lowestPrice",
        dataIndex: "lowestPrice",
        title: "Lowest Price",
        render: (_, record) => g_itemsPricesSchema[record._id].lowestPrice,
      },
      {
        key: "averagePrice",
        dataIndex: "averagePrice",
        title: "Average Price",
        render: (_, record) => g_itemsPricesSchema[record._id].averagePrice,
      },
      {
        key: "volume",
        dataIndex: "volume",
        title: "Volume",
        render: (_, record) => g_itemsPricesSchema[record._id].volume,
      },
      {
        key: "edit",
        dataIndex: "edit",
        render: (_: any, record) => [
          <MarketSellOrderModal
            order={record}
            visible={currentlyEditedMarketHashName === record._id}
            onCancel={() => this.setState({ currentlyEditedMarketHashName: null })}
            onFinish={this.handleOrderUpdate}
          />,
          <Button onClick={() => this.setState({ currentlyEditedMarketHashName: record._id })}>Edit</Button>,
        ],
      },
    ];

    return columns;
  };
  handleSetAutoSellButtonClick = async () => {
    const status = this.state.marketStatus?.isMarketAutoSellOn;

    const newStatus = await mainConnect.market.updateMarketStatus({ isMarketAutoSellOn: !status });

    this.setState({ marketStatus: newStatus });
  };
  handleSendRemoveBatch = () => {
    const { removeListingsBatch } = this.state;
    this.setState({ isLoading: true });
    mainConnect.market
      .removeItemsFromMarket(removeListingsBatch)
      .then(() => {
        this.setState(({ marketSellListings }) => {
          if (!marketSellListings) {
            return null;
          }

          const newState = { ...marketSellListings };

          for (const currency of enumMembersToString(ECurrency)) {
            newState[currency] = newState[currency].filter((l) =>
              removeListingsBatch[currency].some((rl) => !(l.amount === rl.amount && l.marketHashName === rl.marketHashName && l.price && rl.price))
            );
          }
          return { marketSellListings: newState, removeListingsBatch: { eur: [], usd: [], rub: [] } };
        });
      })
      .finally(() => this.setState({ isLoading: false }));
  };
  handleSellSpecifiedButton = () => {
    this.setState({ isLoading: true });
    mainConnect.market.sellItemsOnMarketByPrice().finally(() => this.setState({ isLoading: false }));
  };
  public render() {
    const { marketSellOrders, isCreateModelOpened, isLoading, removeListingsBatch, marketStatus } = this.state;

    const dataSource = Object.values(marketSellOrders);
    const columns = this.getColumns();
    return (
      <Layout>
        <Header>
          <Space>
            <MarketSellOrderModal
              createMode
              visible={isCreateModelOpened}
              onCancel={() => this.setState({ isCreateModelOpened: false })}
              onFinish={this.handleOrderUpdate}
            />
            <Button onClick={() => this.setState({ isCreateModelOpened: true })}>Add item</Button>
            <Button onClick={this.getMarketListings}>Get market listings</Button>
            <Button onClick={this.handleSetAutoSellButtonClick}>Auto sell is {marketStatus?.isMarketAutoSellOn ? "ON" : "OFF"}</Button>

            <Popconfirm title="Are you sure you want to sell these items on market?" onConfirm={this.handleSellSpecifiedButton}>
              <Button>Sell specified</Button>
            </Popconfirm>

            <Popconfirm title="Are you sure you want to remove these items from the market?" onConfirm={() => this.handleSendRemoveBatch()}>
              <Button>
                Remove batch EUR {removeListingsBatch.eur.length} RUB {removeListingsBatch.rub.length} USD {removeListingsBatch.usd.length}
              </Button>
            </Popconfirm>
            <Button onClick={this.getSellOrders}>Get sell orders</Button>
          </Space>
        </Header>
        <Content>
          <Table rowKey={(r) => r._id} loading={isLoading} columns={columns} dataSource={dataSource} />
        </Content>
      </Layout>
    );
  }
}

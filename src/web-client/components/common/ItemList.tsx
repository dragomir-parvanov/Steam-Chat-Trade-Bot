import * as React from "react";
import ParsedItemWithSellInformationModel from "../../../models/models/steam/steam-items/ParsedItemWithSellInformationModel";
import { List, Button, Popover } from "antd";
import ItemSellInformationModel from "../../../models/models/steam/steam-market/ItemSellInformationModel";
import RecordFunctions from "../../../classes/RecordFunctions";
import LogError from "../../../classes/errors/base/LogError";
import applySteamMarketFees, { calculateApiPrice } from "../../../business-logic/steam/calculateMarketplaceSellFee";

export type ItemPaneTradeModeHandlerProp = {
  onItemClick: (item: ParsedItemWithSellInformationModel) => void;
};

export interface ItemListProps {
  items: ParsedItemWithSellInformationModel[];
  calculatePriceBy: keyof Pick<ItemSellInformationModel, "averagePrice" | "lowestPrice" | "sellPrice">;
  shouldApplySteamMarketFee?: boolean;
  shouldCalculateApplyings?: boolean;
  tradeModeHandler?: ItemPaneTradeModeHandlerProp;
}

export interface ItemListState {
  items: ParsedItemWithSellInformationModel[];
}
export default class ItemList extends React.Component<ItemListProps, ItemListState> {
  constructor(props: ItemListProps) {
    super(props);

    this.state = { items: [...props.items] };
  }
  componentWillReceiveProps(props) {
    this.setState(props);
  }
  addItem = (item: ParsedItemWithSellInformationModel) => {
    this.setState((prevState) => ({ items: [...prevState.items, item] }));
  };
  removeItem = (item: ParsedItemWithSellInformationModel) => {
    this.setState((prevState) => ({ items: prevState.items.filter((i) => i.assetId !== item.assetId) }));
  };

  handleClickOnNotSpecialItem = (e: React.MouseEvent<HTMLElement, MouseEvent>, items: ParsedItemWithSellInformationModel[]) => {
    const firstItem = items[0];
    if (!firstItem) {
      throw new LogError("first item is not here");
    }
    const { tradeModeHandler } = this.props;

    if (tradeModeHandler) {
      if (e.ctrlKey) {
        const handledItems = items.filter((i) => i.marketHashName === firstItem.marketHashName);
        handledItems.forEach(tradeModeHandler.onItemClick);
      } else {
        tradeModeHandler.onItemClick(firstItem);
      }
    }
  };

  renderItems = () => {
    const { calculatePriceBy, shouldCalculateApplyings, tradeModeHandler, shouldApplySteamMarketFee } = this.props;
    const { items } = this.state;
    type ItemClassification = { notSpecialItems: ParsedItemWithSellInformationModel[]; specialItems: ParsedItemWithSellInformationModel[] };
    const itemsToRender: Record<string, ItemClassification> = {};
    items.forEach((i) => {
      if (!itemsToRender[i.marketHashName]) {
        itemsToRender[i.marketHashName] = { notSpecialItems: [], specialItems: [] };
      }

      if (i.isSpecial) {
        itemsToRender[i.marketHashName].specialItems.push(i);
      } else {
        itemsToRender[i.marketHashName].notSpecialItems.push(i);
      }
    });
    const JSXItems: JSX.Element[] = [];
    RecordFunctions.forEach(itemsToRender, (i, marketHashName) => {
      let specialItemsPopover: JSX.Element | null = null;
      if (i.specialItems.length > 0) {
        function createPopover() {
          const itemsJSX = i.specialItems.map((i) => {
            const name = i.nametag ? i.nametag : i.marketHashName;
            let price = i[calculatePriceBy] + (shouldCalculateApplyings ? i.applyingsPrice : 0);
            if (shouldApplySteamMarketFee) {
              price = applySteamMarketFees(price);
            }
            const handleItemClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              if (!tradeModeHandler) {
                return;
              }
              if (e.ctrlKey) {
                console.log("control key is pressed");
                const itemsToHandle = items.filter((i2) => i.marketHashName === i2.marketHashName);
                itemsToHandle.forEach((i) => tradeModeHandler.onItemClick(i));
              } else {
                tradeModeHandler.onItemClick(i);
              }
            };
            if (i.stickers.length > 0) {
              const stickersShowing = i.stickers.map((s) => <img src={s.imageUrl}></img>);
              return (
                <Popover content={stickersShowing}>
                  <List.Item onClick={handleItemClick}>
                    {name} {price}
                  </List.Item>
                </Popover>
              );
            } else {
              return (
                <List.Item onClick={handleItemClick}>
                  {name} {price}
                </List.Item>
              );
            }
          });
          return (
            <Popover trigger="click" content={itemsJSX}>
              <Button>S: {i.specialItems.length}</Button>
            </Popover>
          );
        }
        specialItemsPopover = createPopover();
      }
      if (i.notSpecialItems.length === 0 && i.specialItems.length === 0) {
        return;
      }

      let notSpecialItemPrice = i.notSpecialItems?.[0]?.[calculatePriceBy] ?? i.specialItems?.[0]?.[calculatePriceBy];
      if (notSpecialItemPrice == null) {
        console.error("Item", i);
        throw new Error(`Item with name ${marketHashName} doesn't have price in either special items or not special items`);
      }
      if (shouldApplySteamMarketFee) {
        notSpecialItemPrice = applySteamMarketFees(notSpecialItemPrice);
      }
      const item = (
        <List.Item key={marketHashName}>
          {marketHashName}
          {(() => {
            if (i.notSpecialItems.length > 0) {
              return (
                <Button onClick={(e) => this.handleClickOnNotSpecialItem(e, i.notSpecialItems)}>
                  Not S:{notSpecialItemPrice}Euro {i.notSpecialItems.length}
                </Button>
              );
            } else {
              return null;
            }
          })()}
          {specialItemsPopover}
        </List.Item>
      );
      JSXItems.push(item);
    });
    return JSXItems;
  };
  public render() {
    return this.renderItems();
  }
}

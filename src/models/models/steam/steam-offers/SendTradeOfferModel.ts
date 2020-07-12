import ParsedItemModel from "../steam-items/ParsedItemModel";
import ClientAndPartnerIdentfiables from "../../../interfaces/ClientAndPartnerIdentfiables";

export interface NotSpecialItemsInTradOfferModel {
  marketHashName: ParsedItemModel["marketHashName"];
  count: number;
}

export interface ItemsTradeOfferDirectiveModel {
  /**
   * We want to send items with the exact assetids
   * @type {ParsedItemModel["assetId"]}
   * @memberof ItemTradeOfferDirectiveModel
   */
  exactItemAssetIds: ParsedItemModel["assetId"][];

  /**
   * We just want to send items that are not special. That means they have no nametags and no stickers(doesnt count for souvenirs.)
   * @type {NotSpecialItemsInTradOfferModel[]}
   * @memberof ItemTradeOfferDirectiveModel
   */
  notSpecialItems: NotSpecialItemsInTradOfferModel[];
}

export default interface SendTradeOfferModel extends ClientAndPartnerIdentfiables {
  partner: ItemsTradeOfferDirectiveModel;
  client: ItemsTradeOfferDirectiveModel;
  offerMessage?: string;
  tradeOfferLink?: string;
}

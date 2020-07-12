import StickerOnItemModel from "./ItemStickerModel";
import { ECSGOItemExteriorCondition } from "../../../enums/ECSGOItemWearCondition";
import AssetId from "../../../types/AssetId";

export default interface ParsedItemModel {
  marketHashName: string;
  assetId: AssetId;
  appId: number;
  contextId: number;
  amount: number;
  nametag?: string;
  stickers: StickerOnItemModel[];
  isTradable: boolean;
  isStattrak: boolean;
  isSouvenir: boolean;
  exteriorCondition: ECSGOItemExteriorCondition;
  imageUrl: string;
  largeImageUrl: string;
  isSpecial: boolean;

  /**
   * if the skins is AWP | Safari Mesh, this property will be only "AWP"
   *
   * @type {string}
   * @memberof ParsedItemModel
   */
  itemName: string;
}

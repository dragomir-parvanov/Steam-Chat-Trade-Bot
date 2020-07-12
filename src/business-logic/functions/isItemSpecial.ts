import ParsedItemModel from "../../models/models/steam/steam-items/ParsedItemModel";

export default function isItemSpecial(item: ParsedItemModel): boolean {
  if (item.stickers.length > 0 && !item.isSouvenir) {
    return true;
  }

  if (item.nametag) {
    return true;
  }

  return false;
}

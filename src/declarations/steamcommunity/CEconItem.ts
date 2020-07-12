import SteamItemAPIModel from "../../models/models/steam/steam-items/steam-api/SteamItemAPIModel";

/**
 * How is the item coming from the CEconItem class
 * @export
 * @interface CEconItem
 */
export default interface CEconItem extends Omit<SteamItemAPIModel, "tradable"> {
  assetid: string;
  tradable: boolean;
}

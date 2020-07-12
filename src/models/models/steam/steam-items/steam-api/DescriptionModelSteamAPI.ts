/**
 * How the descriptions are coming from the steam api
 * @export
 * @interface DescriptionSteamAPIModel
 */
export default interface DescriptionSteamAPIModel {
  /**
   * The type of the description, most of the time its just "html"
   * @type {string}
   * @memberof DescriptionSteamAPIModel
   */
  type: string;

  /**
   * The value of the description
   * @type {string}
   * @memberof DescriptionSteamAPIModel
   */
  value: string;
  color?: string;
}

import ClientAndPartnerIdentfiables from "../../../../models/interfaces/ClientAndPartnerIdentfiables";
import BeforeTime from "../../interfaces/BeforeTime";

export default interface GetMessagesRequestModel extends ClientAndPartnerIdentfiables, BeforeTime {
  /**
   * Before which time we should look for chats
   * @type {number}
   * @memberof GetMessagesRequestModel
   */
  beforeTime: number;
}

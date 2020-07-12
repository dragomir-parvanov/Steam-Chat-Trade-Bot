import ClientAndPartnerIdentfiables from "../../../../models/interfaces/ClientAndPartnerIdentfiables";

export default interface NewMessageRequestModel extends ClientAndPartnerIdentfiables {
  value: string;
}

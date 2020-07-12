import UserTradingInformationModel from "../../../models/models/steam/steam-offers/UserTradingInformationModel";

export default function generateRandomTradingInformation(): UserTradingInformationModel {
  const info: UserTradingInformationModel = {
    canTrade: Math.random() > 0.3,
  };

  if (info.canTrade) {
    info.escrowDays = Math.floor(Math.random() * 15);
  }
  return info;
}

import { SteamId64 } from "../../models/types/SteamId64";
import SteamID from "steamid";

export default function extractPartnerSteamId64FromTradeOfferLink(tradeOfferLink: string): SteamId64 {
  const regex = new RegExp(/partner=(.*)&/);
  const groups = regex.exec(tradeOfferLink);
  if (!groups?.[1]) {
    throw new Error("Invalid trade offer link");
  }

  return SteamID.fromIndividualAccountID(groups[1]).getSteamID64();
}

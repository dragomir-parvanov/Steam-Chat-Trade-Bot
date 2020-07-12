import SteamChatMessageModel from "../../../../models/models/chats/SteamChatMessageModel";
import { isOfferType } from "../pushJSXMessage";
import { ETradeOfferState } from "steam-tradeoffer-manager";
import LogError from "../../../../classes/errors/base/LogError";
import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import g_cachedTradeOffers from "../../../globals/g_cachedTradeOffers";

export default async function setAllTradeOffersFromMessages(messages: SteamChatMessageModel[]) {
  const offerIds = new Set<string>();

  messages.forEach((m) => {
    if (isOfferType(m.type) && m.type !== (ETradeOfferState.JustCreated as never)) {
      offerIds.add(m.value);
    }
  });
  console.log("offerIds", offerIds);
  if (offerIds.size === 0) {
    return;
  }
  const offers = await mainConnect.items.offers.getOffersById([...offerIds]);
  offers.forEach((o) => {
    g_cachedTradeOffers[o._id] = o;
  });
}

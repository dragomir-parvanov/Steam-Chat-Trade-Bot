import TradeOfferManager from "steam-tradeoffer-manager";
import log from "../../../classes/logger/Log";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import TradeOfferManagerPollData from "../../../models/models/steam/steam-offers/ManagerPollDataModel";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import handleSteamOfferChanged from "./handleSteamOfferChanged";
import SteamUser from "steam-user";
import SteamCommunity from "steamcommunity";
import handleSteamOfferInventoriesChange from "./handleSteamOfferInventoriesChange";
import { SteamId64 } from "../../../models/types/SteamId64";

export default function initializeTradeOfferManagerEventHandler(clientId: SteamId64, user: SteamUser, community: SteamCommunity, manager: TradeOfferManager): void {
  manager.on("newOffer", (offer) => {
    log.do(`Offer received from ${offer.partner.getSteamID64()}`);
  });

  manager.on("sentOfferChanged", async (offer) => {
    console.log("offer changed");
    await handleSteamOfferChanged(offer, clientId);
  });
  manager.on("sentOfferChanged", async (offer) => {
    await handleSteamOfferInventoriesChange(offer, clientId);
  });

  manager.on("pollData", async (data) => {
    const service = new DbServiceBase<TradeOfferManagerPollData>(EMongoDbCollectionNames.TradeOfferManagerPollData);

    await service.updateOne(clientId, { $set: { data: data } }, { upsert: true });
  });
}

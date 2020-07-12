import TradeOfferManager, { TradeOfferManagerOptions } from "steam-tradeoffer-manager";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import TradeOfferManagerPollData from "../../../models/models/steam/steam-offers/ManagerPollDataModel";
import SteamUser from "steam-user";
import SteamCommunity from "steamcommunity";
import { tradeOfferManagerDefaultSettings } from "./config/tradeOfferManagerSettings";
import { SteamId64 } from "../../../models/types/SteamId64";

export default async function createTradeOfferManager(clientId: SteamId64, user: SteamUser, community: SteamCommunity): Promise<TradeOfferManager> {
  const dbService = new DbServiceBase<TradeOfferManagerPollData>(EMongoDbCollectionNames.TradeOfferManagerPollData);
  const pollData = await dbService.findOne(clientId);

  const settings: TradeOfferManagerOptions = {
    ...tradeOfferManagerDefaultSettings,
    ...{
      pollData: pollData?.data as never,
      steam: user,
      community,
    },
  };

  const manager = new TradeOfferManager(settings);

  return manager;
}

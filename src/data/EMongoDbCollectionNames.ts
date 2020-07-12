/**
 * The key names should be the same as the mongodb collection name.
 * @export
 * @enum {number}
 */
export enum EMongoDbCollectionNames {
  SteamClients,
  SteamClientsCredentials,
  SteamClusters,
  ItemsSellInformation,
  MinedProfiles,
  NeverScannedProfiles,
  ToBeMinedProfiles,
  ScannedProfiles,
  ToBeAddedProfiles,
  TradeOffers,
  RegisteredUsers,
  SteamMessages,
  MarketSellOrders,
  SteamMarketIdToMarketHashNameMap,

  //#region this is only used from the steam client to operate
  TradeOfferManagerPollData,
  ToBeScannedProfiles,
  SentItemsInOffers,

  ////#endregion

  //#region  logging
  MinerErrorLogs,
  MinerWarningLogs,
  MinerNormalLogs,
  MainErrorLogs,
  MainWarningLogs,
  MainNormalLogs,
  //#endregion
}

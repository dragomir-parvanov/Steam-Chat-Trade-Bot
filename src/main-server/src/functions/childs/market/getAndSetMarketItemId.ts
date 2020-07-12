import g_availableIPs from "../../../globals/g_availableIPs";
import _ from "lodash";
import DbServiceBase from "../../../../../data/services/Base/DbServiceBase";
import SteamMarketIdToMarketHashNameMapModel from "../../../../../models/models/steam/steam-market/SteamMarketIdToMarketHashNameMapModel";
import { EMongoDbCollectionNames } from "../../../../../data/EMongoDbCollectionNames";
import promisifySteamCommunity from "../../../../../functions/promisify/promisifySteamCommunity";
import SteamCommunity from "steamcommunity";
import LogError from "../../../../../classes/errors/base/LogError";

export default async function getAndSetMarketItemId(marketHashName: string): Promise<string> {
  const db = new DbServiceBase<SteamMarketIdToMarketHashNameMapModel>(EMongoDbCollectionNames.SteamMarketIdToMarketHashNameMap);
  const randomIp = _.sample(g_availableIPs);

  const community = promisifySteamCommunity(new SteamCommunity({ localAddress: randomIp }));
  const uri = `https://steamcommunity.com/market/listings/730/` + marketHashName;
  const options = { uri };
  const result = await community.httpRequestGet(options);

  const body = result.body as string;

  const regexPattern = /ItemActivityTicker.Start\( (.*) \)/gm;
  const regex = new RegExp(regexPattern);

  const groups = regex.exec(body);

  if (!groups?.[1]) {
    throw new LogError(`Cannot find market item name id from an market hash name ${marketHashName}`, body);
  }

  const itemNameId = groups[1];

  await db.updateOne(marketHashName, { $set: { itemNameId: itemNameId } }, { upsert: true });

  return itemNameId;
}

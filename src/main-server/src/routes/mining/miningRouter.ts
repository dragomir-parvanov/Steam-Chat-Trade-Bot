import g_miningStatus from "../../globals/g_miningStatus";
import Axios from "axios";
import cheerio from "cheerio";
import { SteamId64 } from "../../../../models/types/SteamId64";
import DbServiceBase from "../../../../data/services/Base/DbServiceBase";
import NeverScannedProfileModel from "../../../../models/models/steam/steam-profiles/NeverScannedProfileModel";
import { EMongoDbCollectionNames } from "../../../../data/EMongoDbCollectionNames";

export function fr_updateMiningStatus(update: Partial<typeof g_miningStatus>) {
  Object.assign(g_miningStatus, update);
  return g_miningStatus;
}

export function fr_getMiningStatus() {
  return g_miningStatus;
}

export async function scanGroup(groupUrl: string, isCSGOGroups: boolean, fromPage: number, toPage: number) {
  groupUrl = groupUrl.trim();
  const db = new DbServiceBase<NeverScannedProfileModel>(EMongoDbCollectionNames.NeverScannedProfiles);
  const profiles: SteamId64[] = [];
  for (let page = fromPage; page <= toPage; page++) {
    console.log("scanning page", page);
    const response = await Axios.get(`${groupUrl}/memberslistxml?xml=1&p=${page}`);
    const data = response.data;
    const $ = cheerio.load(data, { xmlMode: true });
    const members = ($("members")
      .children()
      .map((i, e) => e.childNodes[0].nodeValue)
      .toArray() as never) as SteamId64[];

    profiles.push(...members);
    if (members.length < 1000) {
      //on each page there are 1000 members,
      // no point in iterating another page if this page is under 1000 members long,
      // because next page will be empty.
      break;
    }
  }
  const docs: NeverScannedProfileModel[] = profiles.map((p) => ({ _id: p, fromCSGOGroup: isCSGOGroups, forwarded: false }));
  return await db.insertMany(docs, { ordered: false });
}

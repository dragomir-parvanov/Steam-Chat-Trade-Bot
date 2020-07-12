import g_clientWorkersInformation from "../../globals/g_clientWorkersInformation";
import SteamClientDbService from "../../../../data/services/SteamClientDbService";
import createSteamChild from "./createSteamChild";
import _ from "lodash";
import wait from "../../../../functions/wait";

export default async function startAllAllowedToRunSteamChilds() {
  const stoppedClients = Object.values(g_clientWorkersInformation).filter((w) => !w.isRunning && w.isAllowedToRun);

  const db = new SteamClientDbService();

  const clientsCursor = db.findMany({ _id: { $nin: Object.values(g_clientWorkersInformation).map((c) => c._id) }, isAllowedToRun: true }, { _id: 1 });
  const clients = await clientsCursor.toArray();

  const combinedClients = [...clients, ...stoppedClients];

  const groupedClients = _.groupBy(combinedClients, "publicIp");
  const promises = Object.values(groupedClients).map((c, i) => {
    return Promise.all(
      c.map(async (c, i) => {
        await wait(i * 5000);
        console.log("creating client with id", c._id);
        await createSteamChild(c._id);
      })
    );
  });

  await Promise.all(promises);
}

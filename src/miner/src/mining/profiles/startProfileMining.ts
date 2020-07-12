import getProfilesToMine from "../../networking/get/getProfilesToMine";
import getXMLParsedProfileWithInventory from "./getXMLParsedProfileWithInventory";
import sendMinedProfiles from "../../networking/post/sendMinedProfiles";
import log from "../../../../classes/logger/Log";
import wait from "../../../../functions/wait";
import XMLParsedProfileWithInventoryModel from "../../../../models/models/steam/steam-profiles/XMLParsedProfileWithInventoryModel";

export default async function startProfileMining(): Promise<void> {
  while (true) {
    const profilesToMine = await getProfilesToMine();
    const minedProfiles: XMLParsedProfileWithInventoryModel[] = [];
    for (const profile of profilesToMine) {
      console.log("starting scanning", profile);
      await getXMLParsedProfileWithInventory(profile)
        .then((p) => {
          minedProfiles.push(p);
        })
        .catch((error) => {
          log.error(new Error(`Not sending profile with steamId64 ${profile}. Error:\n${error.message}`));
        });

      console.log("finished scanning", profile);
      await wait(5000);
    }
    console.log("trying to send profiles count", minedProfiles.length);
    if (minedProfiles.length > 0) {
      console.log("sending profiles");
      await sendMinedProfiles(minedProfiles);
      console.log("profieles are sent!");
    }
  }
}

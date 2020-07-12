import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import XMLParsedProfileWithInventoryModel from "../../../../models/models/steam/steam-profiles/XMLParsedProfileWithInventoryModel";

/**
 * Sends back the profiles that we just mined to the main server
 * @export
 * @param {XMLParsedProfileModel[]} minedProfiles
 * @returns {Promise<void>}
 */
export default async function sendMinedProfiles(minedProfiles: XMLParsedProfileWithInventoryModel[]): Promise<void> {
  // await tryy(
  //   {
  //     maxRetries: mainServerMaxRetriesConstant,
  //     waitOnFail: mainServerWaitOnFailConstant,
  //   },
  //   async () => {
  //     await mainConnect.mining.profiles.sendMinedProfiles(minedProfiles);
  //   }
  // );
  await mainConnect.mining.profiles.sendMinedProfiles(minedProfiles);
}

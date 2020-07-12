import shouldGetInventory from "../../shouldGetInventory";
import { SteamId64 } from "../../../../models/types/SteamId64";
import XMLParsedProfileWithInventoryModel from "../../../../models/models/steam/steam-profiles/XMLParsedProfileWithInventoryModel";
import XMLParsedProfileModel from "../../../../models/models/steam/steam-profiles/XMLParsedProfileModel";
import SteamCommunityFunctions from "../../../../functions/steam/steam-community/SteamCommunityFunctions";
import SteamInventoryModel from "../../../../models/models/steam/steam-items/SteamInventoryModel";
import { EInventoryGetStatus } from "../../../../models/enums/EInventoryGetStatus";
import wait from "../../../../functions/wait";
import g_availableIPs from "../../../../main-server/src/globals/g_availableIPs";

export default async function getXMLParsedProfileWithInventory(partnerId: SteamId64): Promise<XMLParsedProfileWithInventoryModel> {
  const communityFunctions = new SteamCommunityFunctions(null);
  let profile: XMLParsedProfileModel;
  try {
    profile = await communityFunctions.getXMLParsedProfile(partnerId, 10);
  } catch (err) {
    throw new Error(err.message);
  }

  const inventory: SteamInventoryModel = shouldGetInventory(profile)
    ? await communityFunctions.getInventory(partnerId, 730, 2, false, 10)
    : { items: [], getStatus: EInventoryGetStatus.NotNeeded };

  if (inventory.getStatus === EInventoryGetStatus.OtherError || inventory.getStatus === EInventoryGetStatus.MalformedResponse) {
    console.log("cannot get inventory", inventory.errorMessage);
    await wait(10000);
  }

  return { ...{ inventory, _id: partnerId }, ...profile };
}

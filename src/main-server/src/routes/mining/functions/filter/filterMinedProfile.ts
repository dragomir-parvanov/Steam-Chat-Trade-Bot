import DbServiceBase from "../../../../../../data/services/Base/DbServiceBase";
import ToBeMinedProfileModel from "../../../../../../models/models/steam/steam-profiles/ToBeMinedProfileModel";
import { EMongoDbCollectionNames } from "../../../../../../data/EMongoDbCollectionNames";
import MinedProfileModel from "../../../../../../models/models/steam/steam-profiles/MinedProfileModel";
import NeverScannedProfileModel from "../../../../../../models/models/steam/steam-profiles/NeverScannedProfileModel";
import createParsedItemInventoryWithSellInformationModel from "../../../../../../factories/mongo/createParsedItemWithSellInformationModel";
import { pickSteamClientForAddingFriend_new } from "./pickSteamClientForAddingFriend";
import XMLParsedProfileWithInventoryModel from "../../../../../../models/models/steam/steam-profiles/XMLParsedProfileWithInventoryModel";
export default async function filterMinedProfile(partnerProfile: XMLParsedProfileWithInventoryModel): Promise<void> {
  const toBeMinedProfileService = new DbServiceBase<ToBeMinedProfileModel>(EMongoDbCollectionNames.ToBeMinedProfiles);
  const scannedProfilesService = new DbServiceBase<MinedProfileModel>(EMongoDbCollectionNames.ScannedProfiles);
  const neverScannedProfilesService = new DbServiceBase<NeverScannedProfileModel>(EMongoDbCollectionNames.NeverScannedProfiles);

  const neverScannedProfile = await neverScannedProfilesService.findOne({ _id: partnerProfile._id }, { fromCSGOGroup: 1, _id: 0 });

  const { fromCSGOGroup } = neverScannedProfile || { fromCSGOGroup: false };

  const minedProfile: MinedProfileModel = { ...partnerProfile, addedOn: new Date(), fromCSGOGroup };
  if (!partnerProfile.isLimitedAccount) {
    await scannedProfilesService.updateOne({ _id: partnerProfile._id }, { $set: minedProfile }, { upsert: true });
    return;
  }

  const inventory = await createParsedItemInventoryWithSellInformationModel(partnerProfile.inventory.items);

  const inventoryPrice = inventory.reduce((acc, item) => acc + item.averagePrice, 0);
  const theHighestItemPrice = inventory.reduce<number>((prev, item) => (prev > item.averagePrice ? prev : item.averagePrice), 0);

  if (inventoryPrice > 1) {
    const client = pickSteamClientForAddingFriend_new(Math.round(inventoryPrice));

    client.functions.addFriend(partnerProfile._id);
    await scannedProfilesService.updateOne({ _id: partnerProfile._id }, { $set: minedProfile }, { upsert: true });
    return;
  }

  if (theHighestItemPrice > 0.3) {
    const client = pickSteamClientForAddingFriend_new(2);

    client.functions.addFriend(partnerProfile._id);
    await scannedProfilesService.updateOne({ _id: partnerProfile._id }, { $set: minedProfile }, { upsert: true });
    return;
  }

  if (fromCSGOGroup) {
    const client = pickSteamClientForAddingFriend_new(0);

    client.functions.addFriend(partnerProfile._id);
    await scannedProfilesService.updateOne({ _id: partnerProfile._id }, { $set: minedProfile }, { upsert: true });
    return;
  }
  const toBeMinedProfile: ToBeMinedProfileModel = {
    ...partnerProfile,
    ...{
      addedOn: new Date(),
      toBeMinedAfterDays: 15,
      fromCSGOGroup: fromCSGOGroup || false,
      forwarded: false,
    },
  };
  await toBeMinedProfileService.updateOne(
    { _id: partnerProfile._id },
    {
      $set: toBeMinedProfile,
    },
    { upsert: true }
  );
}

import SteamCommunity from "steamcommunity";
import createParsedItem from "../../factories/createParsedItem";
import CEconItem from "../../declarations/steamcommunity/CEconItem";

const community = new SteamCommunity();

community.getUserInventoryContents("76561199001143389", 730, 2, false, (error, inv: CEconItem[]) => {
  if (error) {
    console.error("inventory error", error);
  } else {
    console.log(inv);
    const parsedInv = inv.map((i) => {
      try {
        return createParsedItem(i);
      } catch (error) {
        throw new Error(`assetid ${i.id}, name ${i.market_hash_name}`);
      }
    });
  }
});

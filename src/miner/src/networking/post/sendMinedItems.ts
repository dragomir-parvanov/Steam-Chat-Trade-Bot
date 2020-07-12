import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";
import ItemSellInformationParsedSteamAPIModel from "../../../../models/models/steam/steam-items/ItemSellInformationParsedSteamAPIModel";
import tryy from "../../../../functions/tryy/tryy";
import { MAIN_SERVER_MAX_RETRIES } from "../../../../shared-network/constants/to-main/max-retries/MAIN_SERVER_MAX_RETRIES";
import { MAIN_SERVER_WAIT_ON_FAIL } from "../../../../shared-network/constants/to-main/wait-before-retry/MAIN_SERVER_WAIT_ON_FAIL";

/**
 * Sends back the items that we just mined to the main server.
 * @export
 * @param {ItemSellInformationParsedSteamAPIModel} minedItems
 * @returns {Promise<void>}
 */
export default async function sendMinedItems(minedItems: ItemSellInformationParsedSteamAPIModel[]): Promise<void> {
  await tryy(
    {
      maxRetries: MAIN_SERVER_MAX_RETRIES,
      waitOnFail: MAIN_SERVER_WAIT_ON_FAIL,
    },
    async () => await mainConnect.mining.items.sendMinedItems(minedItems)
  );
}

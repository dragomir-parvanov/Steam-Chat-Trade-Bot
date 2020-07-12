import mainConnect from "../../../../shared-network/express-function-router/implementations/mainConnect";

/**
 * Gets the items that needs to be mined from the main server.
 * @export
 * @returns {string[]}
 */
export default async function getItemsToMine(): Promise<string[]> {
  const items = await mainConnect.mining.items.getItemsToMine();
  return items;
}

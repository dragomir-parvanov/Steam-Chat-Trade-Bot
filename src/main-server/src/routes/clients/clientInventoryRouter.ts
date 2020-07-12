import { Router } from "express";
import g_clientsInventories from "../../../../shared-network/globals/observables/chat-related/g_clientsInventories";
import { SteamId64 } from "../../../../models/types/SteamId64";
import RecordFunctions from "../../../../classes/RecordFunctions";

export function fr_getAllClientInventories() {
  const inventories = g_clientsInventories;
  return inventories;
}

export function fr_getSpecificClientInventory(clientId: SteamId64) {
  const inventory = g_clientsInventories[clientId];

  if (inventory == null) {
    throw new Error(`Inventory for client with id ${clientId} doesn't exist`);
  }
  return inventory;
}

export enum EInventoryGetStatus {
  /**
   * The inventory is ok and we can get it
   */
  Ok,
  PrivateInventory,
  PrivateProfile,
  MalformedResponse,
  /**
   * Cannot get the inventory from the steam server.
   */
  OtherError,
  /**
   * when its not needed to get the inventory.
   */
  NotNeeded,
}

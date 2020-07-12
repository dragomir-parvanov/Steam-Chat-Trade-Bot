export enum EFriendRelationship {
  None = 0,
  Blocked = 1,
  RequestRecipient = 2,
  Friend = 3,
  RequestInitiator = 4,
  Ignored = 5,
  IgnoredFriend = 6,
  SuggestedFriend = 7,
  Max = 8,

  /**
   * This is not coming from steam, we use this to cache someone that we failed to add.
   */
  CachedForAdding,
}

import { EFriendRelationship } from "../../../enums/EFriendRelationship";

/**
 * When getting the friend list from the steam-community module
 * it emits object which key is the steam id64 of the profile and the value is @enum EFriendRelationship
 * @export
 * @type FriendListModel
 */
type FriendListModel = Record<string, EFriendRelationship>;

export default FriendListModel;

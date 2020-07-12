import OnlineUserModel from "../../../models/site/OnlineUserModel";

const g_cachedLoggedUsers: g_cachedLoggedUsersType = {};

export default g_cachedLoggedUsers;

export type g_cachedLoggedUsersType = Record<OnlineUserModel["_id"], OnlineUserModel>;

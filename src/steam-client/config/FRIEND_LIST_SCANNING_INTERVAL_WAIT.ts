import getTime from "../../functions/time/getTime";

/**
 * how much we wait between scanning the friend list.
 */
const FRIEND_LIST_SCANNING_INTERVAL_WAIT = getTime(2, "days");

export default FRIEND_LIST_SCANNING_INTERVAL_WAIT;

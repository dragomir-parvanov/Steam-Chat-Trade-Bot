/**
 * keeping track of which offers we created, so we do not accept some offer made outside of the project.
 */
const g_offerIds: Set<string> = new Set();

export default g_offerIds;

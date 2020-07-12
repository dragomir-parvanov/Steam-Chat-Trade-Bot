import SteamCommunity from "steamcommunity";
import g_steamCookies from "../g_steamCookies";
import TradeOfferManager from "steam-tradeoffer-manager";
import { SteamId64 } from "../../../../../models/types/SteamId64";

/**
 * Initializing cookie configurator, so we dont miss any webSession events.
 * @param community
 * @param manager
 */
export default function initializeCookieConfigurator(clientId: SteamId64, community: SteamCommunity, manager: TradeOfferManager): void {
  g_steamCookies[clientId].subscribe({
    next: async (cookies) => {
      if (cookies) {
        community.setCookies(cookies);
        manager.setCookies(cookies);
      }
    },
  });

  const cookies = g_steamCookies[clientId].getValue();
  if (cookies) {
    // this means that we missed the event, so we use BehaviourSubject to get the last event.
    community.setCookies(cookies);
    manager.setCookies(cookies);
  }
}

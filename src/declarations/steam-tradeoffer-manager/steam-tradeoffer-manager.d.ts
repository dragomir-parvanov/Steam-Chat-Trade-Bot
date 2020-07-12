/* eslint-disable @typescript-eslint/no-explicit-any */
import SteamID = require("steamid");

declare module "steam-tradeoffer-manager" {
  export default class TradeOfferManager {
    //public static readonly ETradeOfferState: TradeStateKeys;
    /**
     * A read-only property containing your account's API key once
     * the callback of `setCookies` fires for the first time.
     *
     * @type {string}
     * @memberof TradeOfferManager
     */
    public readonly apiKey: string;

    constructor(options: TradeOfferManagerOptions);

    //public setCookies(cookies: any, callback: (error: Error | null) => void): void;
    public setCookies(cookies: string[]): void;

    public doPoll(): void;

    public on(event: string, callback: (...args: any[]) => void): void;

    public on(event: "newOffer", callback: (offer: TradeOffer) => void): void;

    public on(event: "pollData", callback: (data: any) => void);

    public on(event: "sentOfferChanged", callback: (offer: TradeOffer, oldState: ETradeOfferState) => void): void;

    public createOffer(partnerId: SteamId64 | SteamID): TradeOffer;
  }
}

declare module "steamcommunity" {
  import { CommunityHttpGet, CommunityHttpPost } from "./SteamCommunityHTTPRequest";
  import ProfileSettingsModel from "./ProfileSettingsModel";
  import SteamCommunityOptions from "./SteamCommunityOptions";
  export default class SteamCommunity {
    constructor(options?: SteamCommunityOptions);

    public setCookies(cookies: string[]): void;

    public acceptAllConfirmations(time: number, confKey: string, allowKey: string, callback: (error: Error | null, confs: object[]) => void): void;

    public acceptConfirmationForObject(identitySecret: string, objectID: string, callback: (error: Error) => void);

    public on(event: string, callback: (...args: any[]) => void): void;

    public on(event: "sessionExpired", callback: (error: Error) => void): void;
    public getSessionID(): string;
    public getUserInventoryContents(
      steamId: string | null,
      appId: number,
      contextId: number,
      tradableOnly: boolean,
      callback: (
        error: Error | null,
        inventory: CEconItem[]
      ) => //currency: object[],
      //totalItems: number,
      void
    ): void;
    public profileSettings(settings: Partial<ProfileSettingsModel>, callback: (error: Error | null) => void);
    public getSteamUser(user: SteamID, callback: (error: Error, user: XMLParsedProfileModel) => void): void;
    public httpRequestGet: CommunityHttpGet;
    public httpRequestPost: CommunityHttpPost;
  }
}

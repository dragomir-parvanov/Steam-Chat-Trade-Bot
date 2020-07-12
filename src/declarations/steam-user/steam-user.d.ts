/* eslint-disable @typescript-eslint/no-explicit-any */
import { usersType } from "./usersType";
import { userType } from "./userType";
import SteamID = require("steamid");
import ECurrencyCode from "./EcurrencyCode";
import { EventEmitter } from "events";

// tslint:disable:max-line-length
declare module "steam-user" {
  export enum EMachineIDType {
    // No machine ID will be provided to Steam
    "None" = 1,

    // A randomly-generated machine ID will be created on each logon
    "AlwaysRandom" = 2,

    // A machine ID will be generated from your account's username
    "AccountNameGenerated" = 3,

    // A random machine ID will be generated and saved to the {dataDirectory}, and will be used for future logons
    "PersistentRandom" = 4,
  }

  export default class SteamUser extends EventEmitter {
    public static readonly EResult: ResultKeys;

    //public static readonly EPersonaState: PersonaStateKeys;
    /**
     * `null` if not connected, a `SteamID` containing your SteamID otherwise.
     *
     * @type {(string | null)}
     * @memberof SteamUser
     */
    public readonly steamID: string | null;

    public readonly publicIp: string | null;

    public logOff(): void;

    public setOption<T extends keyof SteamUserOptions, P extends NonNullable<SteamUserOptions[T]>>(option: T, value: P): void;

    public setOptions(options: SteamUserOptions): void;

    public on(event: string, callback: (...args: any[]) => void): void;

    public on(event: "loggedOn", callback: () => void): void;

    public on(event: "wallet", callback: (hasWallet: boolean, currency: ECurrencyCode, balance: string) => void);

    public on(event: "error", callback: (error: SteamUserError) => void): void;

    public on(event: "webSession", callback: (sessionId: string, cookies: string[]) => void): void;

    public on(event: "friendRelationship", callback: (partnerId: SteamID, relationship: EFriendRelationship) => void): void;

    public on(event: "friendMessage", callback: (partnerId: SteamID, message: string) => void);

    public on();

    public on(event: "steamGuard", callback: (domain: string | null, callback: (code: string) => void, lastCodeWrong: boolean) => void): void;

    public on(event: "playingState", callback: (blocked: boolean, playingApp: string) => void): void;

    public on(event: "user", callback: (partnerId: SteamID, user: userType) => void): void;

    public webLogOn(): void;

    public logOn(params: LogOnParams): void;

    public setPersona(state: EPersonaState, name?: string): void;

    public getPersonas(steamIds: string[], callback?: (err: Error | null, personas: usersType) => void): void;

    public requestFreeLicense(apps: string[], callback: () => void): void;

    public gamesPlayed(apps: Array<string | number | object>, force?: boolean): void;

    public chatMessage(partnerId: SteamId64, message: string): void;

    public addFriend(partnerId: SteamId64, callback: (err: Error | null, nameStatus: string) => void);

    public removeFriend(partnerId: SteamId64): void;

    public myFriends: FriendListModel;

    public users: usersType;

    public wallet?: {
      hasWallet: boolean;
      currency: ECurrencyCode;
      balance: number;
    };
  }
}

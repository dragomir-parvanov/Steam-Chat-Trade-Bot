import SteamCommunity from "steamcommunity";
import XMLParsedProfileModel from "../models/steam/steam-profiles/XMLParsedProfileModel";
import SteamID from "steamid";
import CEconItem from "../../declarations/steamcommunity/CEconItem";

export type PromisifiedSteamCommunity = SteamCommunity & {
  getSteamUser: (partnerId: SteamID) => Promise<XMLParsedProfileModel>;
  getUserInventoryContents: (partnerId: string | SteamID, appId: number, contextId: number, tradableOnly: boolean) => Promise<CEconItem[]>;
  acceptAllConfirmations: (arg1: number, arg2: string, arg3: string) => Promise<object[]>;
  httpRequestGet: (options: any) => Promise<object>;
  httpRequestPost: (options: any) => Promise<object>;
};

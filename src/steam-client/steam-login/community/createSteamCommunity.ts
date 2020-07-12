import { PromisifiedSteamCommunity } from "../../../models/types/PromisifiedCommunity";
import SteamCommunity from "steamcommunity";
import SteamClientModel from "../../../models/models/steam/steam-profiles/SteamClientModel";
import promisifySteamCommunity from "../../../functions/promisify/promisifySteamCommunity";

export default function createSteamCommunity(client: SteamClientModel): PromisifiedSteamCommunity {
    const community = new SteamCommunity({localAddress:client.publicIp});
    return promisifySteamCommunity(community)
}
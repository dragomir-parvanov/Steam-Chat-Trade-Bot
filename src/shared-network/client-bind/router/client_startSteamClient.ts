import ToClientMessageModel from "../models/ToClientMessageModel";
import startSteamClient from "../../../steam-client/startSteamClient";

export default async function client_startSteamClient(this: ToClientMessageModel) {
  return await startSteamClient(this.clientId);
}

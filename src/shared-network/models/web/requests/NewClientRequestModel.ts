import SteamClientModel from "../../../../models/models/steam/steam-profiles/SteamClientModel";
import SteamClientCredentialsModel from "../../../../models/models/steam/steam-profiles/SteamClientCredentialsModel";

export default interface NewClientRequestModel {
  client: SteamClientModel;
  credentials: SteamClientCredentialsModel;
}

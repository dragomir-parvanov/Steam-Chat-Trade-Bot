import SteamUser from "steam-user";
import { usersType } from "../../declarations/steam-user/usersType";

export type PromisifiedSteamUser = SteamUser & {
  getPersonas: (arg1: string[]) => Promise<usersType>;
};

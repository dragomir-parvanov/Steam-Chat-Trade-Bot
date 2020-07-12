import SteamUser from "steam-user";
import { promisify } from "util";
import { PromisifiedSteamUser } from "../../models/types/PromisifiedSteamUser";

export default function promisifySteamUser(user: SteamUser): PromisifiedSteamUser {
  const getPersonas = promisify(user.getPersonas.bind(user));
  user.getPersonas = getPersonas;

  return user as PromisifiedSteamUser;
}

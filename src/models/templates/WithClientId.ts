import { SteamId64 } from "../types/SteamId64";
import WithKey from "./WithKey";

type WithClientId<T> = WithKey<T, "clientId", SteamId64>;

export default WithClientId;

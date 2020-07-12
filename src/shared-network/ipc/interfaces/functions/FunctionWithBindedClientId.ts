import { SteamId64 } from "src/models/types/SteamId64";

export default interface FunctionWithBindedClientId{

    /**
     * The worker steam client id.
     * @type {SteamId64}
     * @memberof FunctionWithBindedClientId
     */
    clientId: SteamId64;
}
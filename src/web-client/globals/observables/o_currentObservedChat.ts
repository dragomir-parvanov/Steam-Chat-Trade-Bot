import { SteamId64 } from "../../../models/types/SteamId64";
import { BehaviorSubject } from "rxjs";

const o_currentObservedChat: BehaviorSubject<SteamId64> = new BehaviorSubject("");

export default o_currentObservedChat;

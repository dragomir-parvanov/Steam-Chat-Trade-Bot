import { Subject } from "rxjs";
import ClientAndPartnerIdentfiables from "../../../models/interfaces/ClientAndPartnerIdentfiables";
import UpdatingSubject from "../../../classes/rxjs-extending/UpdatingSubject";

const o_chatIds = new UpdatingSubject<Set<string>>(new Set());

export default o_chatIds;

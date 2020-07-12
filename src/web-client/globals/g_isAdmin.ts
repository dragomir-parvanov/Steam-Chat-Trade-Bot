import o_currentUser from "./observables/o_currentUser";
import ERegisteredUserClaim from "../../models/site/enums/ERegisteredUserClaim";

export let g_isAdmin = false;

o_currentUser.subscribe((u) => {
  if (u?.claims.some((c) => c === ERegisteredUserClaim.Admin)) {
    g_isAdmin = true;
  } else {
    //g_isAdmin = false;
    g_isAdmin = false;
  }
});

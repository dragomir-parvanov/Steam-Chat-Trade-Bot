import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";

export default function isUserAdmin(user?: RegisteredUserModel | null): boolean {
  if (!user) {
    return false;
  }
  return user.claims.some((c) => c === ERegisteredUserClaim.Admin);
}

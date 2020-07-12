import { Request, Response, NextFunction, RequestHandler } from "express";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";

/**
 * Checks if user is authorized and have the needed claims to access this route.
 * @export
 * @param {(ERegisteredUserClaim | ERegisteredUserClaim[])} neededClaims
 * @param {RequestHandler} handler
 * @returns {RequestHandler}
 */
export default function checkUserClaims(...neededClaims: ERegisteredUserClaim[]): RequestHandler {
  const claimHandler: RequestHandler = (req, res, next) => {
    const user = req.user as RegisteredUserModel;

    if (!user) {
      return res.status(401).send("Not logged in, checkUserClaim");
    }

    if (user.claims.some((c) => c === ERegisteredUserClaim.Admin)) {
      return next();
    }

    if (Array.isArray(neededClaims)) {
      const missingClaims = neededClaims.filter((c) => !user.claims.some((uc) => uc === c));
      if (missingClaims.length > 0) {
        return res.send(`You dont have permission to access this, you are one of these claims:\n${missingClaims.map((c) => ERegisteredUserClaim[c]).join()}`);
      }
    } else {
      if (!user.claims.some((c) => neededClaims)) {
        return res.send(`You dont have permission to access this, you are missing this claim: ${ERegisteredUserClaim[neededClaims]}`);
      }
    }

    // everything is good to go
    next();
  };
  return claimHandler;
}

import passport from "passport";
import createLocalStrategy from "./createLocalStrategy";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import g_cachedLoggedUsers from "./g_cachedLoggedUsers";
import { RequestHandler } from "express";
import OnlineUserModel from "../../../models/site/OnlineUserModel";

export default function configurePassport(app: any) {
  passport.use(createLocalStrategy());

  passport.serializeUser<OnlineUserModel, RegisteredUserModel["_id"]>((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser<OnlineUserModel, RegisteredUserModel["_id"]>((id, done) => {
    const user = g_cachedLoggedUsers[id];
    if (!user) {
      done("Not cached user for that id");
    } else {
      done(null, user);
    }
  });

  // const setUserInLocals: RequestHandler = (req, res, next) => {
  //   console.log("setting user");
  //   req.app.locals.user = req.user;
  //   next();
  // };

  // app.use(setUserInLocals);

  app.use(passport.initialize());
  app.use(passport.session());
}

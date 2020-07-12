import { Strategy, IVerifyOptions } from "passport-local";
import g_cachedLoggedUsers from "./g_cachedLoggedUsers";
import RegisteredUsersDbService from "../../../data/services/RegisteredUsersDbService";

export default function createLocalStrategy(): Strategy {
  const db = new RegisteredUsersDbService();

  const strategy = new Strategy({ usernameField: "_id", passwordField: "password" }, function (username, password, done) {
    const cachedUser = g_cachedLoggedUsers[username];
    if (!cachedUser) {
      console.log("authentication");
      db.authenticateUser(username, password)
        .then((u) => {
          if (u.isActive) {
            g_cachedLoggedUsers[u._id] = { ...u, inChatPage: false };
            done(null, u);
          } else {
            //done(null, false, { message: "Account is not active." });
            g_cachedLoggedUsers[u._id] = { ...u, inChatPage: false };
            done(null, u);
          }
        })
        .catch((error) => {
          console.error(error);
          done(null, false, { message: "No username or password match." });
        });
    } else {
      if (cachedUser.isActive) {
        done(null, cachedUser);
      } else {
        done(null, false, { message: "Account is not active" });
      }
    }
  });

  return strategy;
}

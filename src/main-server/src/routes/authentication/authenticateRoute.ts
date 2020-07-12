import { Router } from "express";
import passport from "passport";
import RegisteredUsersDbService from "../../../../data/services/RegisteredUsersDbService";
import RegisteredUserModel from "../../../../models/site/RegisteredUserModel";
import RegisteredUserCredentialsModel from "../../../../models/site/RegisteredUserCredentialsModel";
import WithId from "../../../../models/templates/WithId";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import checkUserClaims from "../../passport/checkUserClaims";
import managementAuthenticationRoute from "./managementAuthenticationRoute";
import g_cachedLoggedUsers from "../../passport/g_cachedLoggedUsers";
import RegistrationModel from "../../../../models/site/RegistrationModel";

const router = Router();
router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send(req.user);
});
router.get("/logout", (req, res) => {
  const user = req.user as RegisteredUserModel;
  if (!user) {
    res.status(400).send("You are not logged in");
  }

  delete g_cachedLoggedUsers[user._id];
  req.logout();
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  const db = new RegisteredUsersDbService();
  const body: RegistrationModel = req.body;
  await db
    .addUser(body._id, body.password, body.phoneNumber)
    .then(() => res.send("/sucess"))
    .catch((error) => res.status(400).send(error));
});

router.get("/user", (req, res) => {
  const { user } = req;
  delete user?.["password"];
  if (user) {
    res.send(user);
  } else {
    res.status(401).send("You are not logged in");
  }
});

router.get("/users", checkUserClaims(ERegisteredUserClaim.Admin), async (req, res) => {
  const db = new RegisteredUsersDbService();
  const cursor = db.findMany({});
  const users = await cursor.toArray();
  users.forEach((u) => delete u.password);
  res.send(users);
});
router.use(managementAuthenticationRoute);

const authenticateRoute = router;
export default authenticateRoute;

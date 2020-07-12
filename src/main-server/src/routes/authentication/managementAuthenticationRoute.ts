import { Router } from "express";
import checkUserClaims from "../../passport/checkUserClaims";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import WithId from "../../../../models/templates/WithId";
import RegisteredUsersDbService from "../../../../data/services/RegisteredUsersDbService";
import g_cachedLoggedUsers from "../../passport/g_cachedLoggedUsers";
import OnlineUserModel from "../../../../models/site/OnlineUserModel";

const router = Router();
router.patch("/user", checkUserClaims(ERegisteredUserClaim.Admin), async (req, res) => {
  const db = new RegisteredUsersDbService();

  const body = req.body as Partial<OnlineUserModel>;
  if (!body._id) {
    return res.status(400).send("Body had no id");
  }

  delete body.inChatPage;

  if (g_cachedLoggedUsers[body._id]) {
    g_cachedLoggedUsers[body._id] = { ...g_cachedLoggedUsers[body._id], ...body };
  }
  db.updateOne(body._id, { $set: body })
    .then((r) => {
      res.send(r);
    })
    .catch((error) => res.status(500).send(error));
});

router.patch("/addclaims", checkUserClaims(ERegisteredUserClaim.Admin), async (req, res) => {
  const { _id, data } = req.body as WithId<ERegisteredUserClaim[]>;
  const db = new RegisteredUsersDbService();

  await db
    .updateOne(_id, { $push: { claims: { $each: data } } })
    .then(res.end)
    .catch((error) => res.status(500).send(error));
});

router.patch("/removeclaims", checkUserClaims(ERegisteredUserClaim.Admin), async (req, res) => {
  const { _id, data } = req.body as WithId<ERegisteredUserClaim[]>;
  const db = new RegisteredUsersDbService();

  await db
    .updateOne(_id, { $pull: { claims: { $in: data as [] } } })
    .then(res.end)
    .catch((error) => res.status(500).send(error));
});

router.patch("/activestatus", checkUserClaims(ERegisteredUserClaim.Admin), async (req, res) => {
  const { _id, data } = req.body as WithId<boolean>;
  const db = new RegisteredUsersDbService();

  await db
    .updateOne(_id, { $set: { isActive: data } })
    .then(res.end)
    .catch((error) => res.status(500).send(error));
});
export async function fr_getWorkerNames() {
  const db = new RegisteredUsersDbService();
  const result = await db.findMany({}, { _id: 1 }).toArray();
  return result.map((w) => w._id);
}
const managementAuthenticationRoute = router;

export default managementAuthenticationRoute;

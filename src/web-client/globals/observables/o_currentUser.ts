import Axios from "axios";
import RegisteredUserModel from "../../../models/site/RegisteredUserModel";
import { BehaviorSubject } from "rxjs";

const o_currentUser = new BehaviorSubject<RegisteredUserModel | null>(null);

Axios.get("/auth/user").then((r) => {
  r.data.registeredOn = new Date(r.data.registeredOn);
  o_currentUser.next(r.data);
});
export default o_currentUser;

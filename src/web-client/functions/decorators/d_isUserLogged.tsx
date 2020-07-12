import d_userHasClaim from "./d_userHasClaim";
import { Class } from "utility-types";

export default function d_isUserLogged() {
  return function (component: Class<React.Component>) {
    d_userHasClaim([])(component);
  };
}

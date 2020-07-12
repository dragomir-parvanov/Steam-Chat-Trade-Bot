import RegisteredUserModel from "../models/site/RegisteredUserModel";

declare global {
  var app: ExpressAppWebClientModel;
}

interface ExpressAppWebClientModel {
  user?: RegisteredUserModel;
}

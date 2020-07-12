import startSteamClient from "../../../steam-client/startSteamClient";
import SteamUserFunctions from "../../../functions/steam/steam-user/SteamUserFunctions";
import sendOffer from "../../../steam-client/functions/offers/sendOffer";
import client_addFriend from "./client_addFriend";
import client_sendMessage from "./client_sendMessage";
import client_removeFriend from "./client_removeFriend";
import BindRouterType from "../models/BindRouterType";
import client_startSteamClient from "./client_startSteamClient";

const client_clientRouter = {
  startClient: client_startSteamClient,
  addFriend: client_addFriend,
  getClientInventory: function () {},
  getPartnerInventory: function () {},
  changeClientInformation: function () {},
  sendMessage: client_sendMessage,
  sendTradeOffer: sendOffer,
  removeFriend: client_removeFriend,
  setScanningStatus: function () {},
};

export default client_clientRouter;

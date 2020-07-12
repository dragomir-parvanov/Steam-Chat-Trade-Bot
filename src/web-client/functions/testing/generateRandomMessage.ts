import SteamChatMessageModel from "../../../models/models/chats/SteamChatMessageModel";
import { SteamId64 } from "../../../models/types/SteamId64";
import lodash from "lodash";
import ERegisteredUserClaim from "../../../models/site/enums/ERegisteredUserClaim";
import ESteamChatMessageType from "../../../models/enums/ESteamChatMessageType";
import generateGUID from "../../../functions/generateGUID";
export default function generateRandomMessage(clientId: SteamId64, partnerId: SteamId64) {
  const message: SteamChatMessageModel = {
    _id: generateGUID(),
    clientId,
    partnerId,
    addedOn: new Date(),
    type: ESteamChatMessageType.SystemMessage,
    value: `Client id ${clientId} partner id ${partnerId}`,
  };
  return message;
}

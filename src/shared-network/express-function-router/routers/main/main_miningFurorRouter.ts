import validateType from "../../../../functions/validateType";
import ExpressFunctionRouter from "../../ExpressFunctionRouter";
import EHTTPMethods from "../../../../models/enums/EHTTPMethods";
import { fr_getMiningStatus, fr_updateMiningStatus, scanGroup } from "../../../../main-server/src/routes/mining/miningRouter";
import ERegisteredUserClaim from "../../../../models/site/enums/ERegisteredUserClaim";
import checkUserClaims from "../../../../main-server/src/passport/checkUserClaims";
import { fr_getProfilesToMine, fr_sendMinedProfiles } from "../../../../main-server/src/routes/mining/miningProfilesRouter";
import { fr_getItemsToMine, fr_addItem, fr_sendMinedItems } from "../../../../main-server/src/routes/mining/miningItemsRouter";

const main_miningFurorRouter = validateType<ExpressFunctionRouter>()({
  getMiningStatus: {
    type: EHTTPMethods.get,
    func: fr_getMiningStatus,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MiningManagement)],
  },
  updateMiningStatus: {
    type: EHTTPMethods.patch,
    func: fr_updateMiningStatus,
    middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MiningManagement)],
  },
  profiles: {
    getProfilesToMine: {
      type: EHTTPMethods.get,
      func: fr_getProfilesToMine,
    },
    sendMinedProfiles: {
      type: EHTTPMethods.get,
      func: fr_sendMinedProfiles,
    },
    scanGroup: {
      type: EHTTPMethods.post,
      func: scanGroup,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MiningManagement)],
    },
  },
  items: {
    getItemsToMine: {
      type: EHTTPMethods.get,
      func: fr_getItemsToMine,
    },
    sendMinedItems: {
      type: EHTTPMethods.post,
      func: fr_sendMinedItems,
    },
    addItem: {
      type: EHTTPMethods.post,
      func: fr_addItem,
      middlewaresBefore: [checkUserClaims(ERegisteredUserClaim.MiningManagement)],
    },
  },
});

export default main_miningFurorRouter;

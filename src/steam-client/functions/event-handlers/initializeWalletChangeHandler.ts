import { PromisifiedSteamUser } from "../../../models/types/PromisifiedSteamUser";
import { PromisifiedSteamCommunity } from "../../../models/types/PromisifiedCommunity";
import CurrencyRecord from "../../../models/templates/CurrencyRecord";
import { parseMarketPrice } from "../../../factories/ItemSellInformationParsedSteamAPIModel";
import { SteamId64 } from "../../../models/types/SteamId64";
import g_clientWorkersInformation from "../../../main-server/src/globals/g_clientWorkersInformation";
import { ECurrency } from "../../../models/enums/ECurrency";
import buyTF2Tickets from "../store/buyTF2Tickets";
import DbServiceBase from "../../../data/services/Base/DbServiceBase";
import SteamClientModel from "../../../models/models/steam/steam-profiles/SteamClientModel";
import { EMongoDbCollectionNames } from "../../../data/EMongoDbCollectionNames";
import ECurrencyCode from "../../../declarations/steam-user/EcurrencyCode";
import LogError from "../../../classes/errors/base/LogError";
import g_steamInstancesStores from "../../globals/g_steamInstancesStores";
import getECurrencyFromECurrencyCode from "../../../functions/steam/steam-market/getECurrencyFromECurrencyCode";

const PRICES: CurrencyRecord<number> = { eur: 0.9, usd: 0.99, rub: 69 };

export default function initializeWalletChangeHandler(clientId: SteamId64, user: PromisifiedSteamUser, community: PromisifiedSteamCommunity) {
  user.on("wallet", async (hasWallet, currency, balance) => {
    const db = new DbServiceBase<SteamClientModel>(EMongoDbCollectionNames.SteamClients);
    const parsedBalance = parseFloat(balance) || parseMarketPrice(balance);
    const parsedCurrency = (() => {
      // information is coming from ECurrencyCode in nodejs module
      switch (currency) {
        case ECurrencyCode.USD:
          return ECurrency.usd;
        case ECurrencyCode.EUR:
          return ECurrency.eur;
        case ECurrencyCode.RUB:
          return ECurrency.rub;

        default:
          throw new LogError(
            `We have an account which doesn't have one of the common currencies, current currency code ${currency} enum map ${ECurrencyCode[currency]}`
          );
      }
    })();

    await db.updateOne(clientId, { $set: { walletBalance: parsedBalance, walletCurrency: parsedCurrency } });

    g_clientWorkersInformation[clientId].walletBalance = parsedBalance;
    g_clientWorkersInformation[clientId].walletCurrency = parsedCurrency;
  });
  user.on("wallet", async (_, code, balance) => {
    await handleWalletChangeBuyTF2Tickets(clientId, code, balance);
  });

  // if we miss the event
  if (user.wallet) {
    user.emit("wallet", user.wallet.hasWallet, user.wallet.currency, user.wallet.balance);
  }
}

export async function handleWalletChangeBuyTF2Tickets(clientId: SteamId64, code: ECurrencyCode, balance: any) {
  const community = g_steamInstancesStores[clientId].community;
  const parsedBalance = parseFloat(balance) || parseMarketPrice(balance);

  const currency = ECurrency[getECurrencyFromECurrencyCode(code)];
  const tickets = Math.floor(parsedBalance / PRICES[currency]);

  if (tickets > 0) {
    await buyTF2Tickets(community, tickets);
  }
}

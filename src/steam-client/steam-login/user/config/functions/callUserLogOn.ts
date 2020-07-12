import SteamUser from "steam-user";
import SteamTotp from "steam-totp";
import getSteamClientCredentials from "./getSteamClientCredentials";
export default async function callUserLogOn(user: SteamUser, clientId) {
  const { username: accountName, password, sharedSecret } = await getSteamClientCredentials(clientId);
  user.on("steamGuard", function (domain, callback, lastCodeWrong) {
    console.log("Steam Guard code needed from email ending in " + domain);
    if (lastCodeWrong) {
      return console.log("Last code is wrong, not retrying");
    }
    const code = SteamTotp.generateAuthCode(sharedSecret);
    callback(code);
  });
  user.logOn({
    accountName: accountName,
    password: password,
    twoFactorCode: SteamTotp.generateAuthCode(sharedSecret),
  });
}

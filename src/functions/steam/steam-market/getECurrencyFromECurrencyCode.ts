import ECurrencyCode from "../../../declarations/steam-user/EcurrencyCode";
import { ECurrency } from "../../../models/enums/ECurrency";

export default function getECurrencyFromECurrencyCode(code: ECurrencyCode): ECurrency {
  const string = ECurrencyCode[code].toLowerCase();

  return ECurrency[string];
}

import { PromisifiedSteamCommunity } from "../../../models/types/PromisifiedCommunity";
import cheerio from "cheerio";
import LogError from "../../../classes/errors/base/LogError";
export default async function buyTF2Tickets(community: PromisifiedSteamCommunity, amount: number) {
  console.log("before step 1");
  async function getFormData() {
    const uri = "http://store.steampowered.com/buyitem/440/725/" + amount;

    const options = { uri };

    const response = await community.httpRequestGet(options);

    const body = response.body as string;

    const $ = cheerio.load(body);

    const transaction_id = $("[name=transaction_id]").toArray()[0].attribs["value"];

    if (!transaction_id) {
      throw new LogError(`Coulnd't extract transactino id`, body);
    }

    const returnurl = $("[name=returnurl]").toArray()[0].attribs["value"];

    if (!returnurl) {
      throw new LogError(`Coulnd't extract returnurl id`, body);
    }

    const sessionid = community.getSessionID();

    return { transaction_id, sessionid, returnurl, approved: 1 };
  }
  console.log("before step2");
  async function buyItems() {
    console.log("sending request to buy tickets");
    const uri = "https://store.steampowered.com/checkout/approvetxnsubmit";

    const formData = await getFormData();

    const referer = `https://store.steampowered.com/checkout/approvetxn/${formData.transaction_id}/?returnurl=${formData.returnurl}`;
    const options = { uri, formData, referer };

    await community.httpRequestPost(options);

    const finalOptions = { uri: formData.returnurl };
    await community.httpRequestGet(finalOptions);
  }

  await buyItems();
}

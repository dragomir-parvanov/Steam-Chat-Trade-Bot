import { ECSGOItemExteriorCondition } from "../models/enums/ECSGOItemWearCondition";

import LogError from "../classes/errors/base/LogError";
import DescriptionSteamAPIModel from "../models/models/steam/steam-items/steam-api/DescriptionModelSteamAPI";
import StickerOnItemModel from "../models/models/steam/steam-items/ItemStickerModel";
import CEconItem from "../declarations/steamcommunity/CEconItem";
import ParsedItemModel from "../models/models/steam/steam-items/ParsedItemModel";
import isItemSpecial from "../business-logic/functions/isItemSpecial";
import SteamItemAPIModel from "../models/models/steam/steam-items/steam-api/SteamItemAPIModel";

export function getStickers(description?: DescriptionSteamAPIModel[]): StickerOnItemModel[] {
  if (!description) {
    return [];
  }

  let stickerNames: string[] = [];
  const stickerUrls: string[] = [];

  for (let { value } of description) {
    try {
      value = decodeURI(value);
    } catch (error) {
      continue;
    }

    if (value.startsWith(`<br><div id=\"sticker_info\"`)) {
      const nameRegex = new RegExp(/Sticker: ([\s\S]*?)<\/center>/g);
      const nameMatch = nameRegex.exec(value);
      if (!nameMatch) {
        throw new LogError("No regex matched nameRegex");
      }

      stickerNames = nameMatch[1].split(", ");
      const urlRegex = new RegExp(new RegExp(/src="([\s\S]*?)"></g));

      while (true) {
        const match = urlRegex.exec(value);

        if (!match) {
          break;
        }

        stickerUrls.push(match[1]);
      }
    }
  }

  // 2020.05.29 Removed this check, because there is no robust way to retrieve stickers from html
  // we will depend only on the image urls
  // Where is the problem?
  // some items have stickers like these "Sticker: Martha, Don't Worry, I'm Pro"
  // thats 2 stickers, but we cannot really identify that, because there is a "," in the sticker HTML
  if (false && stickerUrls.length != stickerNames.length) {
    throw new LogError(`stickerUrls and stickerNames have a different .length
    \n stickerUrls have ${stickerUrls.length} length and stickerNames have ${stickerNames.length}`);
  }

  const stickers: StickerOnItemModel[] = [];

  for (let i = 0; i < stickerUrls.length; i++) {
    // 2020.05.29 Name is the sticker img also
    stickers.push({ name: stickerUrls[i], imageUrl: stickerUrls[i] });
  }

  return stickers;
}

export function getItemNameTag(item: SteamItemAPIModel | CEconItem): null | string {
  if (item.fraudwarnings) {
    for (const warning of item.fraudwarnings) {
      if (warning.startsWith("Name Tag: ")) {
        const regex = new RegExp(/Name Tag: ''(.+)''/g);
        const match = regex.exec(warning);
        if (match) {
          return match[1];
        }
      }
    }
  }

  return null;
}

/**
 * Gets the wear of the item
 * @export
 * @param {DescriptionSteamAPIModel[]} description
 * @returns {ECSGOItemExteriorCondition}
 */
export function getExteriorCondition(description?: DescriptionSteamAPIModel[]): ECSGOItemExteriorCondition {
  if (!description) {
    return ECSGOItemExteriorCondition.NoWear;
  }
  for (const { value } of description) {
    if (value.startsWith("Exterior:")) {
      if (value.includes("Factory")) {
        return ECSGOItemExteriorCondition.FactoryNew;
      }

      if (value.includes("Minimal")) {
        return ECSGOItemExteriorCondition.MinimalWear;
      }

      if (value.includes("Field")) {
        return ECSGOItemExteriorCondition.FieldTested;
      }

      if (value.includes("Battle")) {
        return ECSGOItemExteriorCondition.BattleScared;
      }
    }
  }

  // no wear found
  return ECSGOItemExteriorCondition.NoWear;
}

function getItemName(item: SteamItemAPIModel | CEconItem): string {
  if (!item?.tags) {
    return "unknown";
  }

  for (const { category, name } of item.tags) {
    if (category === "Weapon") {
      return name;
    }
  }
  return item.market_hash_name;
}

export default function createParsedItem(item: SteamItemAPIModel | CEconItem): ParsedItemModel {
  const stickers = getStickers(item.descriptions);
  const parsedItem: ParsedItemModel = {
    amount: parseInt(item.amount as never),
    appId: parseInt(item.appid as never),
    assetId: item.id,
    stickers,
    contextId: parseInt(item.contextid),
    isTradable: item.tradable ? true : false,
    marketHashName: item.market_hash_name,
    exteriorCondition: getExteriorCondition(item.descriptions),
    itemName: getItemName(item),
    isSouvenir: item.market_hash_name.includes("Souvenir"),
    isStattrak: item.market_hash_name.includes("StatTrak"),
    imageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/" + item.icon_url + "/",
    largeImageUrl: "https://steamcommunity-a.akamaihd.net/economy/image/" + item.icon_url_large + "/",
    isSpecial: false,
  };
  const nametag = getItemNameTag(item);
  if (nametag) {
    parsedItem.nametag = nametag;
  }
  if (isItemSpecial(parsedItem)) {
    parsedItem.isSpecial = true;
  }
  return parsedItem;
}

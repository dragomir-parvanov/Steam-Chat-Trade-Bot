// eslint-disable-next-line @typescript-eslint/no-unused-vars
import mocha, { expect } from "chai";

import createParsedItem from "../../../factories/createParsedItem";

import { mp7, souvenirNovaWithNameTag } from "../../entities/CEconItemResponses";
import CEconItem from "../../../declarations/steamcommunity/CEconItem";

import { ECSGOItemExteriorCondition } from "../../../models/enums/ECSGOItemWearCondition";

import notSpecialMP7 from "../../entities/parsedItems/notSpecialMP7";
import StickerOnItemModel from "../../../models/models/steam/steam-items/ItemStickerModel";
import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
//import ParsedItemModel from "../models/steam-items/ParsedItemModel";

describe("createParsedItem function", () => {
  it("MP7 scorched battle scarred, no special things ", () => {
    const testEntity = mp7 as CEconItem;
    const result = createParsedItem(testEntity);
    const expectedResult = notSpecialMP7;
    expect(result).to.deep.equal(expectedResult);
  });

  it("Souvenir Nova with nametag", () => {
    const testEntity = souvenirNovaWithNameTag as CEconItem;
    const result = createParsedItem(testEntity);

    const expectedStickers: StickerOnItemModel[] = [
      {
        name: "BIG (Gold) | Boston 2018",
        imageUrl: `https://steamcdn-a.akamaihd.net/apps/730/icons/econ/stickers/boston2018/big_gold.e2398fe6e858d74981c7ef78c93d817f381676f6.png`,
      },
      {
        name: "Natus Vincere (Gold) | Boston 2018",
        imageUrl: `https://steamcdn-a.akamaihd.net/apps/730/icons/econ/stickers/boston2018/navi_gold.f0d00970b52ff2024700fd8f2ebfa7620b477690.png`,
      },
      {
        name: "ELEAGUE (Gold) | Boston 2018",
        imageUrl: `https://steamcdn-a.akamaihd.net/apps/730/icons/econ/stickers/boston2018/eleague_gold.eb78f470269c7281942d7e3a8daa7aae9ff4df14.png`,
      },
      {
        name: "electronic (Gold) | Boston 2018",
        imageUrl: `https://steamcdn-a.akamaihd.net/apps/730/icons/econ/stickers/boston2018/sig_electronic_gold.a4b7855bae5c91c725c301fea1730a2698c2267f.png`,
      },
    ];

    const expectedResult: ParsedItemModel = {
      amount: 1,
      appId: 730,
      contextId: 2,
      assetId: "3242345235",
      isTradable: true,
      isStattrak: false,
      isSouvenir: true,
      stickers: expectedStickers,
      marketHashName: `Souvenir Nova | Walnut (Field-Tested)`,
      exteriorCondition: ECSGOItemExteriorCondition.FieldTested,
      nametag: "Luhari ''strokino ezzi",
      itemName: "Nova",
      isSpecial: true,
      imageUrl:
        "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhjxszfcDFM-ciJmo-dlsj5Nr_Yg2YfuJIn2O2Wo92m2gXh-Bdramr1ItKUJlM3YFiC-Ae2kOi7hpbu7cydn2wj5HdE8usZbQ/",
      largeImageUrl:
        "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpouLWzKjhjxszfcDFM-ciJmo-dlsj5Nr_Yg2Zu5MRjjeyPpduj2lDj_UJvYWj2J9KSewU4ZwzRrgS3wO69h8C07ZudynIx63F2s2GdwUL3zT1Nvw/",
    };
    expect(result).to.deep.equal(expectedResult);
  });
});

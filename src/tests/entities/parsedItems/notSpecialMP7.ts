import ParsedItemModel from "../../../models/models/steam/steam-items/ParsedItemModel";
import { ECSGOItemExteriorCondition } from "../../../models/enums/ECSGOItemWearCondition";

const notSpecialMP7: ParsedItemModel = {
  itemName: "MP7",
  amount: 1,
  appId: 730,
  assetId: "mp7 test asset id",
  contextId: 2,
  isTradable: true,
  marketHashName: "MP7 | Scorched (Battle-Scarred)",
  isSouvenir: false,
  isStattrak: false,
  exteriorCondition: ECSGOItemExteriorCondition.BattleScared,
  stickers: [],
  imageUrl:
    "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7PfJYS1O6eO-kYGdjrmtMuuGw2hQuZdwiLjF8dSl0FLg8kI6Yjihdo6TcgVrNV_QqFTvk-7nm9bi6wIOP8kP/",
  largeImageUrl:
    "https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpou6ryFBRw7PfJYS1O6eO-kYGdjsj4MqnWkyUI6ZUm3-rApN70igWwr0tsaz_3LYfDc1dsM1DW-lLrlenv15Pt7p3B1zI97cIJWpqf/",
  isSpecial: false,
};

export default notSpecialMP7;

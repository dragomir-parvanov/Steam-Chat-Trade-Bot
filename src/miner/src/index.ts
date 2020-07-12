require("dotenv").config();
import SteamCommunity from "steamcommunity";
import promisifySteamCommunity from "../../functions/promisify/promisifySteamCommunity";

import startProfileMining from "./mining/profiles/startProfileMining";
import startItemMining from "./mining/items/startItemMining";

import configureMinerLogger from "./config/configureMinerLogger";
import SteamCommunityFunctions from "../../functions/steam/steam-community/SteamCommunityFunctions";
import wait from "../../functions/wait";

const community = promisifySteamCommunity(new SteamCommunity());

configureMinerLogger();

async function start(): Promise<void> {
  async function profilesLoop(): Promise<void> {
    while (true) {
      await startProfileMining();
      await wait(3000);
    }
  }

  async function itemsLoop(): Promise<void> {
    while (true) {
      await startItemMining();
      await wait(3000);
    }
  }

  profilesLoop();
  itemsLoop();
}
const args = process.argv[2];
switch (args) {
  case "items":
    console.log("starting item mining");
    startItemMining();
    break;
  case "profiles":
    console.log("started profile mining");
    startProfileMining();
    break;
  default:
    console.log("started mining items and profiles");
    //startItemMining();
    startProfileMining();
}
console.log("env in miner", process.env.NODE_ENV);

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ETradeOfferState } from "steam-tradeoffer-manager";
import { $Values } from "utility-types";
import { SteamPartner } from "../steam-user/SteamPartner";
import CEconItem from "../steamcommunity/CEconItem";
import BasicSteamInventoryItemAPIModel from "../../models/models/steam/steam-items/steam-api/BasicSteamInventoryItemAPIModel";

interface UserData {
  personName: string;
  context: object;
  escrowDays: number | null;
  probation: boolean;
  avatarIcon: string;
  avatarMedium: string;
  avatarFull: string;
}

export interface TradeOffer {
  readonly id: string;
  readonly partner: SteamPartner;
  readonly message: string;
  readonly state: $Values<typeof ETradeOfferState>;
  readonly updated: Date;
  decline(callback: (error: Error | null) => void): void;

  getExchangeDetails(
    callback: (
      error: Error | null,
      status: $Values<typeof ETradeOfferState>,
      tradeInitTime: Date,
      receivedItems: object[],
      sentItems: object[]
    ) => void
  ): void;

  data(key: string | "data"): unknown;

  data(key: string, value: any): void;

  getUserDetails(callback: (error: Error | null, me: UserData, them: UserData) => void): void;

  addMyItems(items: BasicSteamInventoryItemAPIModel[]): void;

  addTheirItems(items: BasicSteamInventoryItemAPIModel[]): void;

  setMessage(message: string): void;

  send(callback: (error: Error | null, status: "pending" | "sent") => void): void;

  itemsToReceive: CEconItem[];

  itemsToGive: CEconItem[];
}

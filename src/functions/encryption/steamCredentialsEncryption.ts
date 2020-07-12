import SteamClientCredentialsModel from "../../models/models/steam/steam-profiles/SteamClientCredentialsModel";
import crypto from "crypto";
import EncryptedEntity from "../../models/templates/EncryptedEntity";
import { IV_LENGTH } from "./IV_LENGTH";
import generateGUID from "../generateGUID";

export default function encryptSteamCredentials(credentials: SteamClientCredentialsModel): EncryptedEntity<SteamClientCredentialsModel> {
  //hidden
}

export function decryptSteamCredentials(encryptedCredentials: EncryptedEntity<SteamClientCredentialsModel>): SteamClientCredentialsModel {
  //hidden
}

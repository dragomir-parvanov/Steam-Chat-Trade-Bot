import SteamUser from 'steam-user';
import { $Values } from 'utility-types';

export interface SteamUserError extends Error {
  readonly eresult: $Values<typeof SteamUser['EResult']>;
}

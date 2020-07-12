import { EPersonaState } from "../../../declarations/steam-user/EPersonaState";

/**
 * Checks if the persona state is eligible for scanning.
 * @export
 * @param {EPersonaState} state
 * @returns {boolean}
 */
export function isPersonaStateEligibleForScanning(state?: EPersonaState): boolean {
  if (!state) {
    return false;
  }
  switch (state) {
    case EPersonaState.Snooze:
      return true;
    case EPersonaState.Away:
      return true;
    case EPersonaState.LookingToPlay:
      return true;
    case EPersonaState.LookingToTrade:
      return true;
    default:
      return false;
  }
}

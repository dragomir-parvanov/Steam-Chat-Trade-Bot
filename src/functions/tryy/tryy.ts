//import Log from "../../classes/logger/Log"
import wait from "../wait";
import TryySettingsModel from "./TryySettingsModel";
import TryyError from "../../classes/errors/TryyError";
import TryingFunctionParametersModel from "./TryingFunctionParametersModel";
import TryyStateModel from "./TryyStateModel";

/**
 * Trying something until its done
 * You can specify the delay between failed attempts
 * and how many times we are letting that operation to fail.
 * This should be used only when sending requests
 * @export
 * @template T
 * @param {number} tries
 * @param {(() => T | Promise<T>)} functionToExecute
 * @returns {Promise<T>}
 */
export default function tryy<T = void>(settings: TryySettingsModel, functionToExecute: (params: TryingFunctionParametersModel) => T | Promise<T>): Promise<T> {
  const state: TryyStateModel = {};
  const cancelFunction: TryingFunctionParametersModel["cancel"] = (reason: string, noErrorThrow?: boolean) => {
    state.isCancelledWithMessage = reason;
  };
  const params: TryingFunctionParametersModel = {
    cancel: cancelFunction,
  };

  const errors: Error[] = [];
  const promise = new Promise<T>(async (resolve, reject) => {
    if (!settings.maxRetries) {
      settings.maxRetries = 1;
    }
    for (let i = 0; i < settings.maxRetries; i++) {
      if (state.isCancelledWithMessage != null) {
        reject(new TryyError(errors, state.isCancelledWithMessage));
        return;
      }

      // waiting on fail.
      if (i > 0 && settings.waitOnFail) {
        await wait(settings.waitOnFail);
      }

      try {
        const result = await functionToExecute(params);
        if (state.isCancelledWithMessage != null) {
          reject(new TryyError(errors, state.isCancelledWithMessage));
          return;
        }

        resolve(result);
        return;
      } catch (error) {
        errors.push(error);
      }
    }

    if (state.isCancelledWithMessage != null) {
      reject(new TryyError(errors, state.isCancelledWithMessage));
      return;
    }
    reject(new TryyError(errors, "Max tries exceeded"));
  });

  return promise;
}

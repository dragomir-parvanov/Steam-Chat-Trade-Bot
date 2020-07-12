import { LogMessage } from "../../classes/logger/LogMessage";

export default interface TryingFunctionParametersModel {
  cancel: (reason: string, noErrorThrow?: boolean) => void;
}

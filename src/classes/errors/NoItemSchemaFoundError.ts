import LogError from "./base/LogError";

export default class NoItemSchemaFoundError extends LogError {
  constructor(marketHashName: string) {
    super(`Price schema for item with market hash name ${marketHashName} is not found`);
  }
}

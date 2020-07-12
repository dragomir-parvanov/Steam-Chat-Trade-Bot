import RegisteredUserModel from "./RegisteredUserModel";

export default interface OnlineUserModel extends Omit<RegisteredUserModel, "password"> {
  /**
   * If user is in the chat page.
   */
  inChatPage: boolean;
}

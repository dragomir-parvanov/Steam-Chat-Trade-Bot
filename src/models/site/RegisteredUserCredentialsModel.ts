import Identifiable from "../../data/identifiables/Identifiable";

export default interface RegisteredUserCredentialsModel extends Identifiable {
  /**
   * The id must be the username of the user
   * @type {string}
   * @memberof RegisteredUserModel
   */
  _id: string;

  password: string;
}

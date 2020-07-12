import RegisteredUserCredentialsModel from "./RegisteredUserCredentialsModel";
import ERegisteredUserClaim from "./enums/ERegisteredUserClaim";
import RegistrationModel from "./RegistrationModel";

export default interface RegisteredUserModel extends RegistrationModel {
  /**
   * If the user is working with us.
   * @type {boolean}
   * @memberof RegisteredUserModel
   */
  isActive: boolean;

  registeredOn: Date;

  /**
   * To which pages can the user access to.
   * @type {ERegisteredUserClaim[]}
   * @memberof RegisteredUserModel
   */
  claims: ERegisteredUserClaim[];
}

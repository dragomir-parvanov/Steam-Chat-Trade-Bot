import RegisteredUserCredentialsModel from "./RegisteredUserCredentialsModel";

export default interface RegistrationModel extends RegisteredUserCredentialsModel {
  phoneNumber: string;
}

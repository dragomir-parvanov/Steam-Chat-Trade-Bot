export default class AuthenticationError extends Error {
  constructor(message?: string) {
    super(message);
    console.error("User didnt authenticate");
  }
}

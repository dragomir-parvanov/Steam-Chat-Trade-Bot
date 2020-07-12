import RegisteredUserModel from "../../models/site/RegisteredUserModel";
import DbServiceBase from "./Base/DbServiceBase";
import { EMongoDbCollectionNames } from "../EMongoDbCollectionNames";
import AuthenticationError from "../../classes/errors/AuthenticationError";
import hashUserPassword from "../../main-server/src/passport/hashUserPassword";

export default class RegisteredUsersDbService extends DbServiceBase<RegisteredUserModel> {
  constructor() {
    super(EMongoDbCollectionNames.RegisteredUsers);
  }

  async authenticateUser(username: RegisteredUserModel["_id"], password: string): Promise<RegisteredUserModel> {
    const user = await this.findOne(username);

    if (!user) {
      throw new AuthenticationError("User not found");
    }

    if (hashUserPassword(password) === user.password) {
      delete user.password;

      return user;
    } else {
      throw new AuthenticationError("Password doesn't match");
    }
  }

  async addUser(username: string, password: string, phoneNumber: string) {
    if (await this.findOne({ _id: username })) {
      throw new AuthenticationError(`There is already a ${username} registered.`);
    }
    const user: RegisteredUserModel = {
      _id: username,
      password: hashUserPassword(password),
      isActive: false,
      claims: [],
      phoneNumber,
      registeredOn: new Date(),
    };

    await this.insertOne(user);
  }
}

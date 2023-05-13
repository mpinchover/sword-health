import Repo from "../repo";
import { User, UserRole } from "../types";
import * as uuid from "uuid";
import { CreateUserRequest } from "../types";

class AuthController {
  public repo: Repo;

  constructor() {
    this.repo = new Repo();
  }

  createUser = async (user: User): Promise<User> => {
    user.uuid = uuid.v4();
    user.createdAtUTC = new Date();

    return await this.repo.createUser(user);
  };

  getUserByUuid = async (email: string) => {
    return await this.repo.getUserByEmail(email);
  };
}

export default AuthController;

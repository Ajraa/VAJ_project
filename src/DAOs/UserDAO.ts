import { Prisma, User } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { ServerResponse } from "../ServerResponse";

export class UserDAO {
  private _users: Prisma.UserDelegate;

  constructor(users: Prisma.UserDelegate<DefaultArgs>) {
    this._users = users;
  }

  public async login(
    username: string,
    password: string,
  ): Promise<ServerResponse<User>> {
    try {
      return await this._users
        .findFirstOrThrow({
          where: {
            username: username,
            password: password,
          },
        })
        .then((user) => {
          return new ServerResponse<User>(200, "User found", user);
        });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(err.message);
        return new ServerResponse<User>(404, "User not found", null);
      } else if (err instanceof Error) console.log(err.message);

      return new ServerResponse<User>(500, "Server side error", null);
    }
  }

  public async changePassword(username: string, password: string) {
    return await this._users.update({
      where: {
        username: username,
      },
      data: {
        password: password
      }
    })
    .then(user => {
      return new ServerResponse<User>(200, "Password changer", user);
    })
    .catch(err => {
      if (err instanceof Error) console.log(typeof err);
      return new ServerResponse<User>(500, "Server side error", null);
    });
  }

  public async createUser(
    username: string,
    password: string,
    email: string,
  ): Promise<ServerResponse<User>> {
    try {
      return await this._users
        .create({
          data: {
            username: username,
            password: password,
            email: email,
          },
        })
        .then((user) => {
          return new ServerResponse<User>(200, "User created", user);
        })
        .catch((err) => {
          if (err instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(err.message);
            return new ServerResponse<User>(400, "Name has to be unique", null);
          } else {
            console.log(err.message);
            return new ServerResponse<User>(500, "Server side error", null);
          }
        });
    } catch (err) {
      console.log("error");
      if (err instanceof Error) console.log(typeof err);
      return new ServerResponse<User>(500, "Server side error", null);
    }
  }

  public async getUserById(id: number) {
    try {
      return await this._users
        .findFirstOrThrow({
          where: {
            id: id,
          },
        })
        .then((user) => {
          return new ServerResponse<User>(200, "User found", user);
        });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(err.message);
        return new ServerResponse<User>(404, "User not found", null);
      } else if (err instanceof Error) console.log(err.message);

      return new ServerResponse<User>(500, "Server side error", null);
    }
  }

  public async getUserByEmail(email: string) {
    try {
      console.log(email);
      return await this._users
        .findFirstOrThrow({
          where: {
            email: email,
          },
        })
        .then((user) => {
          return new ServerResponse<User>(200, "User found", user);
        });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(err.message);
        return new ServerResponse<User>(404, "User not found", null);
      } else if (err instanceof Error) console.log(err.message);

      return new ServerResponse<User>(500, "Server side error", null);
    }
  }
}

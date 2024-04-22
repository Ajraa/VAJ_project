import express, { Router, Request, Response } from "express";
import { UserDAO } from "../DAOs/UserDAO";
import { User } from "@prisma/client";
import { ServerResponse } from "../ServerResponse";

export class UserRouter {
  private _router: Router;
  private _dao: UserDAO;

  constructor(dao: UserDAO) {
    this._router = express.Router();
    this._dao = dao;

    this.loginRoute();
    this.createUserRoute();
    this.getUserByIdRoute();
  }

  public get router() {
    return this._router;
  }

  private loginRoute(): void {
    this._router.post("/login", async (req: Request, res: Response) => {
      const username: string = req.query.username as string;
      const password: string = req.query.password as string;

      if (!username || !password)
        return res
          .status(400)
          .json(
            new ServerResponse<User>(
              400,
              "Username and password are required",
              null,
            ),
          );

      await this._dao
        .login(username, password)
        .then((sres) => {
          return res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private createUserRoute(): void {
    this._router.post("/createUser", async (req: Request, res: Response) => {
      const username: string = req.query.username as string;
      const password: string = req.query.password as string;

      if (!username || !password)
        return res
          .status(400)
          .json(
            new ServerResponse<User>(
              400,
              "Username and password are required",
              null,
            ),
          );

      const email: string = `${username}@vsb.cz`;

      await this._dao
        .createUser(username, password, email)
        .then((sres) => {
          return res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private getUserByIdRoute(): void {
    this._router.get("/getUser/:id", async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id);      
      if (!id)
        return res
          .status(400)
          .json(new ServerResponse<User>(400, "Id is required", null));

      await this._dao
        .getUserById(id)
        .then((sres) => {
          return res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private processError(err: Error, res: Response): void {
    console.log(err.message);
    res
      .status(500)
      .json(new ServerResponse<User>(500, "Internal server error", null));
  }
}

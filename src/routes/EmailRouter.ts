import express, { Router, Request, Response } from "express";
import { EmailDAO } from "../DAOs/EmailDAO";
import { Email } from "@prisma/client";

export class EmailRouter {
  private _router: Router;
  private _dao: EmailDAO;

  constructor(dao: EmailDAO) {
    this._router = express.Router();
    this._dao = dao;

    this.sendEmailRoute();
    this.loadActiveEmailRoute();
    this.loadDeletedEmailsRoute();
    this.deleteEmailRoute();
  }

  public get router() {
    return this._router;
  }

  private sendEmailRoute(): void {
    this._router.post("/send", async (req: Request, res: Response) => {
      const fromId: number = parseInt(req.query.fromId as string);
      const toId: number = parseInt(req.query.toId as string);
      const title: string = req.query.title as string;
      const content: string = req.query.content as string;

      await this._dao
        .sendEmail(fromId, toId, title, content)
        .then((sres) => {
          res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private loadActiveEmailRoute(): void {
    this._router.get("/loadactive/:id", async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id);
      if (!id)
        return res
          .status(400)
          .json(new ServerResponse<Email>(400, "Id is required", null));

      await this._dao
        .loadAcviteEmails(id)
        .then((sres) => {
          res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private loadDeletedEmailsRoute(): void {
    this._router.get("/loadactive/:id", async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id);
      if (!id)
        return res
          .status(400)
          .json(new ServerResponse<Email>(400, "Id is required", null));

      await this._dao
        .loadDeletedEmails(id)
        .then((sres) => {
          res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private deleteEmailRoute(): void {
    this._router.delete("/delete", async (req: Request, res: Response) => {
      const userId: number = parseInt(req.query.userId as string);
      const mailId: number = parseInt(req.query.mailId as string);

      if (!userId || !mailId)
        return res
          .status(400)
          .json(
            new ServerResponse<Email>(
              400,
              "UserId and mailID are required",
              null,
            ),
          );

      await this._dao
        .deleteEmail(userId, mailId)
        .then((sres) => {
          res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private processError(err: Error, res: Response): void {
    console.log(err.message);
    res
      .status(500)
      .json(new ServerResponse<Email>(500, "Internal server error", null));
  }
}

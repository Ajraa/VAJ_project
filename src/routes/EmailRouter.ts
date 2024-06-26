import express, { Router, Request, Response } from "express";
import { EmailDAO } from "../DAOs/EmailDAO";
import { Email } from "@prisma/client";
import { ServerResponse } from "../ServerResponse";

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
    this.markDeletedRoute();
    this.markReadRoute();
    this.loadSentEmailsRoute();
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
    this._router.get(
      "/loaddeleted/:id",
      async (req: Request, res: Response) => {
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
      },
    );
  }

  private loadSentEmailsRoute(): void {
    this._router.get("/loadsent/:id", async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id);
        if (!id)
          return res
            .status(400)
            .json(new ServerResponse<Email[]>(400, "Id is required", null)); 
      await this._dao.loadSentEmails(id)
      .then(sres => {
        res.status(sres.code).json(sres);
      })
      .catch((err) => this.processError(err, res));
    });
  }

  private markDeletedRoute(): void {
    this._router.put(
      "/markdeleted/:id",
      async (req: Request, res: Response) => {
        const id: number = parseInt(req.params.id);
        if (!id)
          return res
            .status(400)
            .json(new ServerResponse<Email>(400, "Id is required", null));

        await this._dao
          .markDeleted(id)
          .then((sres) => {
            res.status(sres.code).json(sres);
          })
          .catch((err) => this.processError(err, res));
      },
    );
  }

  private deleteEmailRoute(): void {
    this._router.delete("/delete/:id", async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id);

      if (!id)
        return res
          .status(400)
          .json(
            new ServerResponse<Email>(
              400,
              "Id is required",
              null,
            ),
          );

      await this._dao
        .deleteEmail(id)
        .then((sres) => {
          res.status(sres.code).json(sres);
        })
        .catch((err) => this.processError(err, res));
    });
  }

  private markReadRoute(): void {
    this._router.put("/markread/:id", async (req: Request, res: Response) => {
      const id: number = parseInt(req.params.id);

      this._dao
        .markRead(id)
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

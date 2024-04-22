
import express, { Router, Request, Response } from "express";
import { EmailDAO } from "../DAOs/EmailDAO";
import { Email } from "@prisma/client";

export class EmailRouter {
    private _router: Router;
    private _dao: EmailDAO;

    constructor(dao: EmailDAO) {
        this._router = express.Router();
        this._dao = dao;
    }

    public get router() {
        return this._router;
    }

    private sendEmail(): void {
        this._router.post('/send', async (req: Request, res: Response) => {
            const fromId: number = parseInt(req.query.fromId as string);
            const toId: number = parseInt(req.query.toId as string);
            const title: string = req.query.title as string;
            const content: string = req.query.content as string;

            this._dao.sendEmail(fromId, toId, title, content)
            .then(sres => {
                res.status(sres.code).json(sres);
            })
            .catch(err => this.processError(err, res));

        });
    }

    private processError(err: Error, res: Response): void {
        console.log(err.message);
        res
          .status(500)
          .json(new ServerResponse<Email>(500, "Internal server error", null));
      }
}
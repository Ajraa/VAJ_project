import { Prisma, Email } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export class EmailDAO {
  private _emails: Prisma.EmailDelegate<DefaultArgs>;

  constructor(emails: Prisma.EmailDelegate<DefaultArgs>) {
    this._emails = emails;
  }

  public async sendEmail(
    from: number,
    to: number,
    title: string,
    content: string,
  ): Promise<ServerResponse<Email>> {
    return await this._emails
      .create({
        data: {
          fromId: from,
          toId: to,
          title: title,
          content: content,
        },
      })
      .then((email) => {
        return new ServerResponse(200, "Email sent", email);
      })
      .catch((err) => {
        if (err instanceof Error) console.log(err.message);
        return new ServerResponse<Email>(500, "Server side error", null);
      });
  }

  public async loadAcviteEmails(
    userId: number,
  ): Promise<ServerResponse<Email[]>> {
    return await this._emails
      .findMany({
        where: {
          toId: userId,
          deleted: false,
        },
      })
      .then((emails) => {
        return new ServerResponse<Email[]>(200, "Email sent", emails);
      })
      .catch((err) => {
        if (err instanceof Error) console.log(err.message);
        return new ServerResponse<Email[]>(500, "Server side error", null);
      });
  }

  public async loadDeletedEmails(
    userId: number,
  ): Promise<ServerResponse<Email[]>> {
    return await this._emails
      .findMany({
        where: {
          toId: userId,
          deleted: true,
        },
      })
      .then((emails) => {
        return new ServerResponse<Email[]>(200, "Email sent", emails);
      })
      .catch((err) => {
        if (err instanceof Error) console.log(err.message);
        return new ServerResponse<Email[]>(500, "Server side error", null);
      });
  }

  public async deleteEmail(
    userId: number,
    mailId: number,
  ): Promise<ServerResponse<null>> {
    return await this._emails
      .delete({
        where: {
          toId: userId,
          id: mailId,
        },
      })
      .then(() => {
        return new ServerResponse<null>(200, "Email deleted", null);
      })
      .catch((err) => {
        if (err instanceof Error) console.log(err.message);
        return new ServerResponse<null>(500, "Server side error", null);
      });
  }
}

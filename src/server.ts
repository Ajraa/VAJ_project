import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { UserDAO } from "./DAOs/UserDAO";
import { EmailDAO } from "./DAOs/EmailDAO";
import { UserRouter } from "./routes/UserRouter";
import { EmailRouter } from "./routes/EmailRouter";

const app: Express = express();
const prisma = new PrismaClient();

const userDAO = new UserDAO(prisma.user);
const emailDAO = new EmailDAO(prisma.email);

const userRouter = new UserRouter(userDAO);
const emailRouter = new EmailRouter(emailDAO);

app.use("/user", userRouter.router);
app.use("/email", emailRouter.router);

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
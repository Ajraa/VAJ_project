import express, { Express, Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { UserDAO } from "./DAOs/UserDAO";
import { EmailDAO } from "./DAOs/EmailDAO";
import { UserRouter } from "./routes/UserRouter";

const app: Express = express();
const prisma = new PrismaClient();

const userDAO = new UserDAO(prisma.user);
const emailDAO = new EmailDAO(prisma.email);

const userRouter = new UserRouter(userDAO);

app.use("/user", userRouter.router);

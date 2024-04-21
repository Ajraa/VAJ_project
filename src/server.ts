import express, { Express, Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { UserDAO } from "./DAOs/UserDAO";

const app: Express = express();
const prisma = new PrismaClient();

const userDAO = new UserDAO(prisma.user);

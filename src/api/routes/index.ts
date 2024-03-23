import { Router } from "express";
import { makeHealthRouter } from "./healthRouter";
import { makePontoRouter } from "./pontoRouter";

export function makeServerRouter(): Router {
    const serverRouter = Router();

    serverRouter.use("/health", makeHealthRouter());
    serverRouter.use("/ponto", makePontoRouter());

    return serverRouter;
}

import { pontoController } from "controllers";
import { Router } from "express";

export function makePontoRouter(): Router {
    const pontoRouter = Router();

    pontoRouter.post("/:usuarioId", async (req, res, next) =>
        pontoController.post(req, res, next),
    );

    pontoRouter.get("/:usuarioId", async (req, res, next) => {
        pontoController.getAllByUsuarioId(req, res, next);
    });

    pontoRouter.get("/report/:usuarioId", async (req, res, next) => {
        pontoController.getEmailReportByUsuarioId(req, res, next);
    });

    return pontoRouter;
}

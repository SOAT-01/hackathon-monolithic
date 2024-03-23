import { NextFunction, Request, Response } from "express";
import { PontoUseCase } from "useCases";
import { StatusCode } from "utils/statusCode";

export class PontoController {
    constructor(private readonly pontoUseCase: PontoUseCase) {}

    public async post(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const { usuarioId } = req.params;

            const result = await this.pontoUseCase.create(usuarioId);
            return res.status(StatusCode.created).json({ id: result.id });
        } catch (error) {
            next(error);
        }
    }

    public async getAllByUsuarioId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            const { usuarioId } = req.params;

            const result = await this.pontoUseCase.getAllByUsuarioId(usuarioId);
            return res.status(StatusCode.ok).json(result);
        } catch (error) {
            next(error);
        }
    }

    public async getEmailReportByUsuarioId(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        const { usuarioId } = req.params;

        try {
            await this.pontoUseCase.getEmailReportByUsuarioId(usuarioId);
            return res.status(StatusCode.ok).end();
        } catch (error) {
            next(error);
        }
    }
}

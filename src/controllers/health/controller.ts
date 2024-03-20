import { NextFunction, Request, Response } from "express";

export class HealthController {
    public async get(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<Response> {
        try {
            return res.status(200).send("Healthy");
        } catch {
            next(next);
        }
    }
}

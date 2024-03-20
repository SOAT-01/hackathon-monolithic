import { PontoController } from "./controller";
import { PontoUseCaseFactory } from "useCases";

export class PontoControllerFactory {
    public static create(): PontoController {
        const pontoUseCase = PontoUseCaseFactory.create();

        return new PontoController(pontoUseCase);
    }
}

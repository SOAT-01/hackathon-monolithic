import { HealthControllerFactory } from "./health";
import { PontoControllerFactory } from "./ponto";

export const healthController = HealthControllerFactory.create();
export const pontoController = PontoControllerFactory.create();

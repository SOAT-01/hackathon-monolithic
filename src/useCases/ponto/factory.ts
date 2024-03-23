import { serverConfig } from "config";
import { PontoPostgresGateway, UsuarioPostgresGateway } from "gateways";
import { QueueManager } from "external/queueService";
import { SQSClient } from "external/queueService/client";
import { PostgresDB } from "external/postgres";
import { PontoSchema, UsuarioSchema } from "external/postgres/schemas";
import { PontoUseCase } from "./pontoUseCase";

export class PontoUseCaseFactory {
    public static create(): PontoUseCase {
        const pontoGateway = new PontoPostgresGateway(PostgresDB, PontoSchema);
        const usuarioGateway = new UsuarioPostgresGateway(
            PostgresDB,
            UsuarioSchema,
        );

        const emailQueueManager = new QueueManager(
            serverConfig.queues.email,
            SQSClient,
        );

        return new PontoUseCase(
            pontoGateway,
            usuarioGateway,
            emailQueueManager,
        );
    }
}

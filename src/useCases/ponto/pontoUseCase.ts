import { Ponto, Tipo } from "entities/ponto";
import { PontoGateway, UsuarioGateway } from "interfaces/gateways";
import { QueueManager } from "external/queueService";
import { PontoMapper } from "adapters/mappers/pontoMapper";
import { ResourceNotFoundError } from "utils/errors/resourceNotFoundError";
import { ValidationError } from "utils/errors/validationError";
import { IPontoUseCase } from "./ponto.interface";
import { PontoDTO, PontoReportDTO } from "./dto";

export class PontoUseCase implements IPontoUseCase {
    private readonly DefaultTipo: Tipo = "entrada";

    constructor(
        private readonly pontoGateway: PontoGateway,
        private readonly usuarioGateway: UsuarioGateway,
        private readonly emailQueueManager: QueueManager,
    ) {}

    public async create(usuarioId: string): Promise<PontoDTO> {
        if (!usuarioId) {
            throw new ValidationError("É necessário informar id do usuário");
        }

        let tipo: Tipo = this.DefaultTipo;

        const latestPonto = await this.pontoGateway.findLatestByUsuarioId(
            usuarioId,
        );

        if (latestPonto) {
            tipo = this.parseTipo(latestPonto.tipo);
        }

        const result = await this.pontoGateway.create(usuarioId, tipo);

        return PontoMapper.toDTO(result);
    }

    public async getAllByUsuarioId(
        usuarioId: string,
    ): Promise<PontoReportDTO[]> {
        if (!usuarioId) {
            throw new ValidationError("É necessário informar id do usuário");
        }

        const results = await this.pontoGateway.findManyByUsuarioId(usuarioId);

        if (!results.length)
            throw new ResourceNotFoundError("Pontos não encontrados");

        return this.mapReportDTO(results);
    }

    public async getEmailReportByUsuarioId(usuarioId: string): Promise<void> {
        if (!usuarioId) {
            throw new ValidationError("É necessário informar id do usuário");
        }

        const results = await this.pontoGateway.findManyByUsuarioId(usuarioId);

        if (!results.length)
            throw new ResourceNotFoundError("Pontos não encontrados");

        const usuario = await this.usuarioGateway.findById(usuarioId);

        const reportPayload = this.mapReportDTO(results);

        await this.emailQueueManager.enqueueMessage(
            JSON.stringify({
                usuarioId: usuario.id,
                usuarioEmail: usuario.email,
                pontos: reportPayload,
            }),
        );
    }

    private parseTipo(lastTipo?: Tipo): Tipo {
        switch (lastTipo) {
            case "entrada":
                return "saida_intervalo";

            case "saida_intervalo":
                return "entrada_intervalo";

            case "entrada_intervalo":
                return "saida";

            case "saida":
            default:
                return "entrada";
        }
    }

    private calculateHoursPassed(startDate: Date, endDate: Date): number {
        const millisecondsPerHour = 1000 * 60 * 60;
        const millisecondsPassed = Math.abs(
            endDate.getTime() - startDate.getTime(),
        );
        return Math.floor(millisecondsPassed / millisecondsPerHour);
    }

    private formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    private formatTime(date: Date): string {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    private formatHours(hours: number): string {
        const absoluteHours = Math.abs(hours);
        const formattedHours = Math.floor(absoluteHours);
        const minutes = Math.floor((absoluteHours - formattedHours) * 60);

        const sign = hours < 0 ? "-" : "";

        return `${sign}${formattedHours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;
    }

    private groupByDate(pontos: Ponto[]): { [key: string]: Ponto[] } {
        return pontos.reduce((acc, obj) => {
            const dateKey = this.formatDate(obj.data);

            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }

            acc[dateKey].push(obj);

            return acc;
        }, {});
    }

    private mapReportDTO(pontos: Ponto[]): PontoReportDTO[] {
        const groupedByDate = this.groupByDate(pontos);

        const result: PontoReportDTO[] = [];

        Object.keys(groupedByDate).forEach((date) => {
            const pontos = groupedByDate[date];

            if (pontos.length <= 3) {
                const [entrada, saidaIntervalo] = pontos;

                const firstPeriod = this.calculateHoursPassed(
                    entrada.data,
                    saidaIntervalo.data,
                );

                result.push({
                    data: date,
                    entrada: this.formatTime(entrada.data),
                    saidaAlmoco: this.formatTime(saidaIntervalo.data),
                    entradaAlmoco: "-",
                    saida: "-",
                    totalHoras: this.formatHours(firstPeriod),
                });
            } else {
                const [entrada, saidaIntervalo, entradaIntervalo, saida] =
                    pontos;

                const firstPeriod = this.calculateHoursPassed(
                    entrada.data,
                    saidaIntervalo.data,
                );

                const secondPeriod = this.calculateHoursPassed(
                    entradaIntervalo.data,
                    saida.data,
                );

                const totalHora = firstPeriod + secondPeriod;

                result.push({
                    data: date,
                    entrada: this.formatTime(entrada.data),
                    saidaAlmoco: this.formatTime(saidaIntervalo.data),
                    entradaAlmoco: this.formatTime(entradaIntervalo.data),
                    saida: this.formatTime(saida.data),
                    totalHoras: this.formatHours(totalHora),
                });
            }
        });

        return result;
    }
}

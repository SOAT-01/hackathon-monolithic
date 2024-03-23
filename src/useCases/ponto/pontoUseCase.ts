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

        const results =
            await this.pontoGateway.findManyFromLastMonthByUsuarioId(usuarioId);

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

    private calculateTimePassed(
        startDate: Date,
        endDate: Date,
    ): { hours: number; minutes: number } {
        const millisecondsPerHour = 1000 * 60 * 60;
        const millisecondsPerMinute = 1000 * 60;

        const millisecondsPassed = Math.abs(
            endDate.getTime() - startDate.getTime(),
        );

        const hours = Math.floor(millisecondsPassed / millisecondsPerHour);
        const remainingMilliseconds = millisecondsPassed % millisecondsPerHour;

        const minutes = Math.floor(
            remainingMilliseconds / millisecondsPerMinute,
        );

        return { hours, minutes };
    }

    private formatTime(hours: number, minutes: number): string {
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:00`;
    }

    private sumTime(
        timeA: { hours: number; minutes: number },
        timeB: { hours: number; minutes: number },
    ): { hours: number; minutes: number; formated: string } {
        let hours = timeA.hours + timeB.hours;
        let minutes = timeA.minutes + timeB.minutes;

        if (minutes >= 60) {
            hours += Math.floor(minutes / 60);
            minutes %= 60;
        }

        return {
            hours,
            minutes,
            formated: this.formatTime(hours, minutes),
        };
    }

    private formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    private formatDateToTime(date: Date): string {
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
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
        if (!pontos.length) return [];

        const groupedByDate = this.groupByDate(pontos);

        const result: PontoReportDTO[] = [];

        Object.keys(groupedByDate).forEach((date) => {
            const pontos = groupedByDate[date];
            const sorted = pontos.sort(
                (a, b) => a.data.valueOf() - b.data.valueOf(),
            );

            if (sorted.length <= 3) {
                const [entrada, saidaIntervalo] = sorted;

                const firstPeriod = this.calculateTimePassed(
                    entrada.data,
                    saidaIntervalo.data,
                );

                result.push({
                    data: date,
                    entrada: this.formatDateToTime(entrada.data),
                    saidaAlmoco: this.formatDateToTime(saidaIntervalo.data),
                    entradaAlmoco: "-",
                    saida: "-",
                    totalHoras: this.formatTime(
                        firstPeriod.hours,
                        firstPeriod.minutes,
                    ),
                });
            } else {
                const [entrada, saidaIntervalo, entradaIntervalo, saida] =
                    sorted;

                const firstPeriod = this.calculateTimePassed(
                    entrada.data,
                    saidaIntervalo.data,
                );

                const secondPeriod = this.calculateTimePassed(
                    entradaIntervalo.data,
                    saida.data,
                );

                const totalTempo = this.sumTime(firstPeriod, secondPeriod);

                result.push({
                    data: date,
                    entrada: this.formatDateToTime(entrada.data),
                    saidaAlmoco: this.formatDateToTime(saidaIntervalo.data),
                    entradaAlmoco: this.formatDateToTime(entradaIntervalo.data),
                    saida: this.formatDateToTime(saida.data),
                    totalHoras: totalTempo.formated,
                });
            }
        });

        return result;
    }
}

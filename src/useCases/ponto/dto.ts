import { Tipo } from "entities/ponto";

export interface PontoDTO {
    id?: string;
    tipo: Tipo;
    data: Date;
    usuarioId: string;
}

export interface PontoReportDTO {
    data: string;
    entrada: string;
    saidaAlmoco: string;
    entradaAlmoco: string;
    saida: string;
    totalHoras: string;
}

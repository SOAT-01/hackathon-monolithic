import { Ponto, Tipo } from "entities/ponto";

export interface PontoGateway {
    create(usuarioId: string, tipo: Tipo): Promise<Ponto | undefined>;
    findLatestByUsuarioId(usuarioId: string): Promise<Ponto | undefined>;
    findManyByUsuarioId(usuarioId: string): Promise<Ponto[] | undefined>;
    findManyFromLastMonthByUsuarioId(
        usuarioId: string,
    ): Promise<Ponto[] | undefined>;
}

import { eq, and, gte, lt, desc } from "drizzle-orm";
import { PostgresDB } from "external/postgres";
import { PontoSchema } from "external/postgres/schemas";
import { PontoGateway } from "interfaces/gateways";
import { Ponto, Tipo } from "entities/ponto";
import { PontoMapper } from "adapters/mappers";

export class PontoPostgresGateway implements PontoGateway {
    constructor(
        private readonly postgresDB: typeof PostgresDB,
        private readonly pontoSchema: typeof PontoSchema,
    ) {}

    public async create(
        usuarioId: string,
        tipo: Tipo,
    ): Promise<Ponto | undefined> {
        const [result] = await this.postgresDB
            .insert(this.pontoSchema)
            .values({
                usuarioId,
                tipo,
            })
            .returning();

        return PontoMapper.toDomain(result);
    }

    public async findLatestByUsuarioId(
        usuarioId: string,
    ): Promise<Ponto | undefined> {
        const [result] = await this.postgresDB
            .select()
            .from(this.pontoSchema)
            .where(eq(this.pontoSchema.usuarioId, usuarioId))
            .orderBy(desc(this.pontoSchema.data))
            .limit(1);

        if (!result) return undefined;

        return PontoMapper.toDomain(result);
    }

    public async findManyByUsuarioId(
        usuarioId: string,
    ): Promise<Ponto[] | undefined> {
        const results = await this.postgresDB
            .select()
            .from(this.pontoSchema)
            .where(eq(this.pontoSchema.usuarioId, usuarioId))
            .orderBy(desc(this.pontoSchema.data));

        if (!results.length) return undefined;

        return results.map(PontoMapper.toDomain);
    }

    public async findManyFromLastMonthByUsuarioId(
        usuarioId: string,
    ): Promise<Ponto[] | undefined> {
        const results = await this.postgresDB
            .select()
            .from(this.pontoSchema)
            .where(
                and(
                    eq(this.pontoSchema.usuarioId, usuarioId),
                    // TODO FIX DATES TO ONLY PREVIOUS FROM CURRENT MONTH
                    gte(this.pontoSchema.data, new Date()),
                    lt(this.pontoSchema.data, new Date()),
                ),
            )
            .orderBy(desc(this.pontoSchema.data));

        if (!results.length) return undefined;

        return results.map(PontoMapper.toDomain);
    }
}

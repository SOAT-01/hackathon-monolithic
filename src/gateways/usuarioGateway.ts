import { eq } from "drizzle-orm";
import { Usuario } from "entities/usuario";
import { PostgresDB } from "external/postgres";
import { UsuarioSchema } from "external/postgres/schemas";
import { UsuarioGateway } from "interfaces/gateways";
import { UsuarioMapper } from "adapters/mappers";

export class UsuarioPostgresGateway implements UsuarioGateway {
    constructor(
        private readonly postgresDB: typeof PostgresDB,
        private readonly usuarioSchema: typeof UsuarioSchema,
    ) {}

    public async findById(id: string): Promise<Usuario | undefined> {
        const [result] = await this.postgresDB
            .select()
            .from(this.usuarioSchema)
            .where(eq(this.usuarioSchema.id, id));

        if (!result) return undefined;

        return UsuarioMapper.toDomain(result);
    }
}

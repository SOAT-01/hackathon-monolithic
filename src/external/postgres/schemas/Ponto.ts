import {
    pgSchema,
    uuid,
    varchar,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";
export const pontoSchema = pgSchema("Ponto");

export const pgTipoEnum = pgEnum("tipo", [
    "entrada",
    "saida_intervalo",
    "entrada_intervalo",
    "saida",
]);

export const PontoSchema = pontoSchema.table("pontos", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tipo: pgTipoEnum("tipo"),
    data: timestamp("data").defaultNow().notNull(),
    usuarioId: varchar("usuario_id", { length: 256 }),
});

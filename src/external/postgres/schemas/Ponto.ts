import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const pgTipoEnum = pgEnum("tipo", [
    "entrada",
    "saida_intervalo",
    "entrada_intervalo",
    "saida",
]);

export const PontoSchema = pgTable("pontos", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    tipo: pgTipoEnum("tipo"),
    data: timestamp("data").defaultNow().notNull(),
    usuarioId: varchar("usuario_id", { length: 256 }),
});

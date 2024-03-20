import { pgSchema, uuid, varchar } from "drizzle-orm/pg-core";

export const usuarioSchema = pgSchema("Usuario");

export const UsuarioSchema = usuarioSchema.table("Usuarios", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    matricula: varchar("matricula", { length: 256 }),
    nome: varchar("nome", { length: 256 }),
    email: varchar("email", { length: 256 }),
    senha: varchar("senha", { length: 256 }),
});

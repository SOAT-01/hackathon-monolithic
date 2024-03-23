DO $$ BEGIN
 CREATE TYPE "tipo" AS ENUM('entrada', 'saida_intervalo', 'entrada_intervalo', 'saida');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pontos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo" "tipo",
	"data" timestamp DEFAULT now() NOT NULL,
	"usuario_id" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matricula" varchar(256),
	"nome" varchar(256),
	"email" varchar(256),
	"senha" varchar(256)
);

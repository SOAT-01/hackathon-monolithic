CREATE SCHEMA "Ponto";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "tipo" AS ENUM('entrada', 'saida_intervalo', 'entrada_intervalo', 'saida');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Ponto"."pontos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tipo" "tipo",
	"data" timestamp DEFAULT now() NOT NULL,
	"usuario_id" varchar(256)
);

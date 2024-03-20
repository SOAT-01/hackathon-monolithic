import { parseEnvInt, parseEnvStr } from "./utils";

export const serverConfig = {
    env: parseEnvStr("NODE_ENV", "development"),
    port: parseEnvInt("PORT", 6001),
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV === "development",
    postgres: {
        database: parseEnvStr("POSTGRES_DB", "hackathon"),
        host: parseEnvStr("POSTGRES_DB_HOST", "127.0.0.1"),
        port: parseEnvInt("POSTGRES_DB_PORT", 5432),
        user: parseEnvStr("POSTGRES_DB_USER", "root"),
        password: parseEnvStr("POSTGRES_DB_PASSWORD", "root"),
        schemaFolder: "./src/external/postgres/schemas/*",
        migrationFolder: "./src/external/postgres/migrations",
    },
    sqs: {
        region: parseEnvStr("SQS_REGION"),
        accessKeyId: parseEnvStr("SQS_ACCESS_KEY_ID"),
        secretAccessKey: parseEnvStr("SQS_SECRET_ACCESS_KEY"),
        pollingWaitTimeMs: parseEnvInt("SQS_POLLING_WAIT_TIME", 0),
    },
    queues: {
        email: parseEnvStr(
            "QUEUE_EMAIL",
            "https://sqs.us-east-1.amazonaws.com/146747026776/relatorio-notificacao",
        ),
    },
} as const;

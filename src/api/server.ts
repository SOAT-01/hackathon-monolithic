import express from "express";
import helmet from "helmet";
import nocache from "nocache";
import { serve, setup } from "swagger-ui-express";
import { errorHandler } from "./middlewares";
import { makeServerRouter } from "./routes";
import { requestLogger } from "../utils/requestLogger";
import { SwaggerConfig } from "./docs";
import { serverConfig } from "config";

// TODO FIX TESTS
// TODO FIX API DOCS

require("dotenv").config();

function buildServer() {
    const server = express();

    server.disable("x-powered-by");
    server.use(helmet());
    server.use(nocache());

    if (serverConfig.isProduction) {
        server.use(
            helmet.hsts({
                maxAge: 31536000,
                includeSubDomains: true,
            }),
        );
    }

    server.use(requestLogger);

    server.use(express.json({ limit: "10mb" }));
    server.use(express.urlencoded({ extended: true, limit: "10mb" }));

    server.use("/api-docs", serve, setup(SwaggerConfig));
    server.use("/api", makeServerRouter());
    server.use(errorHandler);

    return server;
}

export const server = buildServer();

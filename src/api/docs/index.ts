import { ApiPaths } from "./paths";

export const SwaggerConfig = {
    openapi: "3.0.0",
    info: {
        title: "fiap-soat1-hackathon",
        description:
            "Projeto do hackathon da pós tech Fiap Arquitetura de Software",
        version: "1.0.0",
    },
    servers: [
        {
            url: "/api",
        },
    ],
    tags: [
        {
            name: "ponto",
            description: "Rotas relacionadas a ponto",
        },
    ],
    paths: ApiPaths,
};

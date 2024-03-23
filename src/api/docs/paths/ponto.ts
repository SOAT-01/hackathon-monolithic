import { serverError, unprocessableEntity } from "../defaults";

export const PontoPaths = {
    "/ponto/{usuarioId}": {
        get: {
            tags: ["ponto"],
            summary: "Rota para obter lista de pontos de um usuário",
            parameters: [
                {
                    in: "path",
                    name: "usuarioId",
                    description:
                        "id do usuario que será utilizado para buscar lista de pontos",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Lista de pontos encontrada",
                    content: {
                        "application/json": {
                            schema: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        data: {
                                            type: "string",
                                            example: "10-01-2024",
                                        },
                                        entrada: {
                                            type: "string",
                                            example: "09:00:00",
                                        },
                                        saidaAlmoco: {
                                            type: "string",
                                            example: "12:00:00",
                                        },
                                        entradaAlmoco: {
                                            type: "string",
                                            example: "13:00:00",
                                        },
                                        saida: {
                                            type: "string",
                                            example: "18:00:00",
                                        },
                                        totalHoras: {
                                            type: "string",
                                            example: "08:00",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                422: {
                    ...unprocessableEntity,
                },
                500: {
                    ...serverError,
                },
            },
        },
        post: {
            tags: ["ponto"],
            summary: "Rota para registrar o ponto de um usuário",
            parameters: [
                {
                    in: "path",
                    name: "usuarioId",
                    description:
                        "id do usuario que será utilizado para o registro de ponto",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Pontos registrado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    id: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                    },
                },
                422: {
                    ...unprocessableEntity,
                },
                500: {
                    ...serverError,
                },
            },
        },
    },
    "/ponto/report/{usuarioId}": {
        get: {
            tags: ["ponto"],
            summary:
                "Rota para obter lista de pontos do mês anterior de um usuário por email",
            parameters: [
                {
                    in: "path",
                    name: "usuarioId",
                    description:
                        "id do usuario que será utilizado para buscar lista de pontos do mês anterior e enviar por email",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Pagamento encontrado",
                },
                422: {
                    ...unprocessableEntity,
                },
                500: {
                    ...serverError,
                },
            },
        },
    },
};

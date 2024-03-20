import { serverError, unprocessableEntity } from "../defaults";

const PedidoFields = {
    valorTotal: {
        type: "number",
    },
    clienteId: {
        type: "string",
    },
    itens: {
        type: "array",
        items: {
            type: "object",
            properties: {
                produtoId: { type: "string" },
                quantidade: { type: "number" },
                preco: { type: "number" },
                nome: { type: "string" },
            },
        },
    },
    observacoes: {
        type: "string",
    },
};

const RequiredFields = ["status", "valorTotal", "itens"];

export const PontoPaths = {
    "/ponto/{id}": {
        get: {
            tags: ["pedido"],
            summary: "Rota para obter o status de pagamento de um pedido",
            parameters: [
                {
                    in: "path",
                    name: "id",
                    description: "id do pedido a ser encontrado",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Pagamento encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                type: "string",
                                example: { pagamento: "pagamento_pendente" },
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
    "/ponto/report/{id}": {
        get: {
            tags: ["pedido"],
            summary: "Rota para obter o status de pagamento de um pedido",
            parameters: [
                {
                    in: "path",
                    name: "id",
                    description: "id do pedido a ser encontrado",
                    required: true,
                    schema: {
                        type: "string",
                    },
                },
            ],
            responses: {
                200: {
                    description: "Pagamento encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                type: "string",
                                example: { pagamento: "pagamento_pendente" },
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
};

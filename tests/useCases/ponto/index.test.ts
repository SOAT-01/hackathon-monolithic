import { Ponto, Tipo } from "entities/ponto";
import { Usuario } from "entities/usuario";
import { QueueManager } from "external/queueService";
import { SQSClient } from "external/queueService/client";
import { PontoGateway, UsuarioGateway } from "interfaces/gateways";
import { PontoUseCase } from "useCases";

jest.mock("aws-sdk", () => {
    return {
        SQS: jest.fn().mockImplementation(() => {
            return {
                sendMessage: jest.fn().mockReturnValue({
                    promise: jest.fn(),
                }),
            };
        }),
    };
});

const pontoMock1 = new Ponto({
    id: "id-1",
    usuarioId: "usuarioId-1",
    data: new Date("2024-01-10T09:00:00"),
    tipo: "entrada",
});

const pontoMock2 = new Ponto({
    id: "id-2",
    usuarioId: "usuarioId-1",
    data: new Date("2024-01-10T12:00:00"),
    tipo: "saida_intervalo",
});

const pontoMock3 = new Ponto({
    id: "id-3",
    usuarioId: "usuarioId-1",
    data: new Date("2024-01-10T13:00:00"),
    tipo: "entrada_intervalo",
});

const pontoMock4 = new Ponto({
    id: "id-4",
    usuarioId: "usuarioId-1",
    data: new Date("2024-01-10T18:00:00"),
    tipo: "saida",
});

const PontoListMock = [pontoMock1, pontoMock2, pontoMock3, pontoMock4];

const usuarioMock = new Usuario({
    id: "id-1",
    matricula: "usuario-123",
    nome: "John Doe",
    email: "john.doe@email.com",
});

describe("Given PedidoUseCases", () => {
    let pontogatewayStub: PontoGateway;
    let usuarioGatewayStub: Partial<UsuarioGateway>;
    let queueMock: QueueManager;
    let sut: PontoUseCase;

    class PontoGatewayStub implements PontoGateway {
        create(usuarioId: string, tipo: Tipo): Promise<Ponto> {
            return new Promise((resolve) => resolve(pontoMock1));
        }
        findLatestByUsuarioId(usuarioId: string): Promise<Ponto> {
            return new Promise((resolve) => resolve(pontoMock1));
        }
        findManyByUsuarioId(usuarioId: string): Promise<Ponto[]> {
            return new Promise((resolve) => resolve(PontoListMock));
        }
        findManyFromLastMonthByUsuarioId(usuarioId: string): Promise<Ponto[]> {
            return new Promise((resolve) => resolve(PontoListMock));
        }
    }

    class UsuarioGatewayStub implements Partial<UsuarioGateway> {
        findById(id: string): Promise<Usuario> {
            return new Promise((resolve) => resolve(usuarioMock));
        }
    }

    beforeAll(() => {
        pontogatewayStub = new PontoGatewayStub();
        usuarioGatewayStub = new UsuarioGatewayStub();
        queueMock = new QueueManager("test", SQSClient);
        sut = new PontoUseCase(
            pontogatewayStub,
            usuarioGatewayStub as UsuarioGateway,
            queueMock,
        );
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    describe("When create is called", () => {
        it("should create ponto", async () => {
            const pontogatewayCreate = jest.spyOn(pontogatewayStub, "create");

            await sut.create("usuarioId-1");
            expect(pontogatewayCreate).toHaveBeenCalled();
        });
    });
    describe("When create is called", () => {
        it("should create ponto", async () => {
            const pontogatewayFindLatestByUsuarioId = jest.spyOn(
                pontogatewayStub,
                "findLatestByUsuarioId",
            );
            const pontogatewayCreate = jest.spyOn(pontogatewayStub, "create");

            await sut.create("usuarioId-1");
            expect(pontogatewayFindLatestByUsuarioId).toHaveBeenCalled();
            expect(pontogatewayCreate).toHaveBeenCalled();
        });
    });
    describe("When getAllByUsuarioId is called", () => {
        it("should return ponto list correctly formated", async () => {
            const pontogatewayFindManyByUsuarioId = jest.spyOn(
                pontogatewayStub,
                "findManyByUsuarioId",
            );

            const result = await sut.getAllByUsuarioId("usuarioId-1");
            expect(pontogatewayFindManyByUsuarioId).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].data).toEqual("10-01-2024");
            expect(result[0].totalHoras).toEqual("08:00");
        });
    });
    describe("When getAllByUsuarioId is called", () => {
        it("should use ponto list", async () => {
            const pontogatewayFindManyFromLastMonthByUsuarioId = jest.spyOn(
                pontogatewayStub,
                "findManyFromLastMonthByUsuarioId",
            );

            await sut.getEmailReportByUsuarioId("usuarioId-1");
            expect(
                pontogatewayFindManyFromLastMonthByUsuarioId,
            ).toHaveBeenCalled();
        });
    });
});

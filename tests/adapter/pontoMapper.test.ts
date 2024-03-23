import { PontoMapper } from "adapters/mappers";
import { Ponto } from "entities/ponto";
import { PontoDTO } from "useCases";

describe("Given PontoMapper", () => {
    const PontoDTOMock: PontoDTO = {
        id: "id-1",
        usuarioId: "usuarioId-1",
        data: new Date(),
        tipo: "entrada",
    };
    const PontoEntityMock = new Ponto({
        id: "id-1",
        usuarioId: "usuarioId-1",
        data: new Date(),
        tipo: "entrada",
    });

    describe("When toDomain is called", () => {
        it("should parse a PontoDTO to Domain format", async () => {
            const parsed = PontoMapper.toDomain(PontoDTOMock);

            expect(parsed).toBeInstanceOf(Ponto);

            expect(parsed.id).toEqual(PontoDTOMock.id);
            expect(parsed.usuarioId).toEqual(PontoDTOMock.usuarioId);
            expect(parsed.data).toEqual(PontoDTOMock.data);
            expect(parsed.tipo).toEqual(PontoDTOMock.tipo);
        });
    });
    describe("When toDTO is called", () => {
        it("should parse a PontoDTO to Domain format", async () => {
            const parsed = PontoMapper.toDTO(PontoEntityMock);

            expect(parsed.id).toEqual(PontoEntityMock.id);
            expect(parsed.usuarioId).toEqual(PontoEntityMock.usuarioId);
            expect(parsed.data).toEqual(PontoEntityMock.data);
            expect(parsed.tipo).toEqual(PontoEntityMock.tipo);
        });
    });
});

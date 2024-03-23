import { Ponto } from "entities/ponto";

describe("Given Ponto Entity", () => {
    describe("when received all params correctly", () => {
        it("should create a new instance of Ponto", () => {
            const ponto = new Ponto({
                id: "id-1",
                usuarioId: "usuarioId-1",
                data: new Date(),
                tipo: "entrada",
            });

            expect(ponto).toBeInstanceOf(Ponto);
        });
    });
});

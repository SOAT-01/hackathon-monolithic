import { Usuario } from "entities/usuario";

describe("Given Usuario Entity", () => {
    describe("when received all params correctly", () => {
        it("should create a new instance of Usuario", () => {
            const usuario = new Usuario({
                id: "id-1",
                matricula: "usuario-123",
                nome: "John Doe",
                email: "john.doe@email.com",
            });

            expect(usuario).toBeInstanceOf(Usuario);
        });
    });
});

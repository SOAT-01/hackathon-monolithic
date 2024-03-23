import { UsuarioMapper } from "adapters/mappers";
import { Usuario } from "entities/usuario";
import { UsuarioDTO } from "useCases";

describe("Given UsuarioMapper", () => {
    const UsuarioDTOMock: UsuarioDTO = {
        id: "id-1",
        matricula: "usuario-123",
        nome: "John Doe",
        email: "john.doe@email.com",
    };

    describe("When toDomain is called", () => {
        it("should parse a UsuarioDTO to Domain format", async () => {
            const parsed = UsuarioMapper.toDomain(UsuarioDTOMock);

            expect(parsed).toBeInstanceOf(Usuario);

            expect(parsed.id).toEqual(UsuarioDTOMock.id);
            expect(parsed.matricula).toEqual(UsuarioDTOMock.matricula);
            expect(parsed.nome).toEqual(UsuarioDTOMock.nome);
            expect(parsed.email).toEqual(UsuarioDTOMock.email);
        });
    });
});

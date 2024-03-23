import { Usuario } from "entities/usuario";

export interface UsuarioGateway {
    findById(id: string): Promise<Usuario | undefined>;
}

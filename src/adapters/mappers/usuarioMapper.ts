import { Usuario } from "entities/usuario";
import { UsuarioDTO } from "useCases";

export class UsuarioMapper {
    public static toDomain(dto: UsuarioDTO): Usuario {
        return new Usuario({
            id: dto?.id,
            matricula: dto.matricula,
            nome: dto?.nome,
            email: dto?.email,
        });
    }

    // public static toDTO(entitie: Ponto): PontoDTO {
    //     return {
    //         id: entitie?.id,
    //         usuarioId: entitie.usuarioId,
    //         data: entitie?.data,
    //         tipo: entitie?.tipo,
    //     };
    // }
}

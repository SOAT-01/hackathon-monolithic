import { Ponto } from "entities/ponto";
import { PontoDTO } from "useCases";

export class PontoMapper {
    public static toDomain(dto: PontoDTO): Ponto {
        return new Ponto({
            id: dto?.id,
            usuarioId: dto.usuarioId,
            data: dto?.data,
            tipo: dto?.tipo,
        });
    }

    public static toDTO(entitie: Ponto): PontoDTO {
        return {
            id: entitie?.id,
            usuarioId: entitie.usuarioId,
            data: entitie?.data,
            tipo: entitie?.tipo,
        };
    }
}

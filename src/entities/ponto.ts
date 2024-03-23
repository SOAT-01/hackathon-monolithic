import { Entity } from "interfaces/entity.interface";
import { AssertionConcern } from "utils/assertionConcern";

export enum TipoEnum {
    Entrada = "entrada",
    SaidaIntervalo = "saida_intervalo",
    RetornoIntervalo = "entrada_intervalo",
    Saida = "saida",
}

export type Tipo = `${TipoEnum}`;

export class Ponto implements Entity {
    id: string;
    tipo: Tipo;
    data: Date;
    usuarioId: string;

    constructor({
        id,
        tipo,
        data,
        usuarioId,
    }: {
        id?: string;
        tipo: Tipo;
        data: Date;
        usuarioId: string;
    }) {
        this.id = id;
        this.tipo = tipo;
        this.data = data;
        this.usuarioId = usuarioId;

        this.validateEntity();
    }

    public validateEntity(): void {
        AssertionConcern.assertArgumentNotEmpty(
            this.usuarioId,
            "UsuarioId is required",
        );
        AssertionConcern.assertArgumentNotEmpty(this.tipo, "Tipo is required");
        AssertionConcern.assertArgumentIsValid(
            this.tipo,
            Object.values(TipoEnum),
            "Tipo should have a valid value",
        );
    }
}

import { Entity } from "interfaces/entity.interface";
import { AssertionConcern } from "utils/assertionConcern";

export enum TipoEnum {
    Entrada = "saida",
    Saida = "entrada",
}

export type Tipo = `${TipoEnum}`;

export class Ponto implements Entity {
    id: string;
    tipo: Tipo;
    data: Date;
    usuarioId: string;
    observacao: string;

    constructor({
        id,
        tipo,
        data,
        usuarioId,
        observacao,
    }: {
        id?: string;
        tipo: Tipo;
        data: Date;
        usuarioId: string;
        observacao: string;
    }) {
        this.id = id;
        this.tipo = tipo;
        this.data = data;
        this.usuarioId = usuarioId;
        this.observacao = observacao;

        this.validateEntity();
    }

    public validateEntity(): void {
        AssertionConcern.assertArgumentNotEmpty(
            this.usuarioId,
            "Preço is required",
        );
        AssertionConcern.assertArgumentNotEmpty(
            this.tipo,
            "Categoria is required",
        );
        AssertionConcern.assertArgumentIsValid(
            this.tipo,
            Object.values(TipoEnum),
            "Categoria should have a valid value",
        );
        AssertionConcern.assertArgumentNotEmpty(
            this.observacao,
            "Descrição is required",
        );
    }
}

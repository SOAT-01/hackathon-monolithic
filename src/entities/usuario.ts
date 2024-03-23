import { Entity } from "interfaces/entity.interface";
import { AssertionConcern } from "utils/assertionConcern";

export class Usuario implements Entity {
    id: string;
    matricula: string;
    nome: string;
    email: string;

    constructor({
        id,
        matricula,
        nome,
        email,
    }: {
        id: string;
        matricula: string;
        nome: string;
        email: string;
    }) {
        this.id = id;
        this.matricula = matricula;
        this.nome = nome;
        this.email = email;

        this.validateEntity();
    }

    public validateEntity(): void {
        AssertionConcern.assertArgumentNotEmpty(this.nome, "Nome is required");
        AssertionConcern.assertArgumentNotEmpty(
            this.matricula,
            "Matricula is required",
        );
        AssertionConcern.assertArgumentNotEmpty(
            this.email,
            "Email is required",
        );
    }
}

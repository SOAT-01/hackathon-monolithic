import { Email } from "valueObjects";

import { Entity } from "../interfaces/entity.interface";
import { AssertionConcern } from "utils/assertionConcern";

interface UsuarioProperties
    extends Omit<
        Usuario,
        "id" | "createdAt" | "updatedAt" | "deletedAt" | "validateEntity"
    > {
    id?: string;
}

export class Usuario implements Entity {
    id: string;
    nome: string;
    email: Email;

    constructor(fields: UsuarioProperties) {
        this.id = fields?.id;
        this.nome = fields.nome;
        this.email = fields.email;

        this.validateEntity();
    }

    public validateEntity(): void {
        AssertionConcern.assertArgumentNotEmpty(this.nome, "Nome is required");
        AssertionConcern.assertArgumentNotEmpty(
            this.email,
            "Email is required",
        );
    }
}

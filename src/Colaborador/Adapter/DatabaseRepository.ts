// src/colaborador/adapter/DatabaseRepository.ts


import { Colaborador } from "../Entity/Colaborador";
import { RepositoryInterface } from "./RepositoryInterface";

export class DatabaseRepository implements RepositoryInterface {
  
  async find(id: number): Promise<Colaborador> {
    // implementação
    throw new Error("Not implemented");
  }

  async search(query: string): Promise<Colaborador[]> {
    // implementação
    throw new Error("Not implemented");
  }

  async findAll(): Promise<Colaborador[]> {
    // Mock temporário - substituir por consulta real ao banco
    return [
      new Colaborador(1, "João Silva", "Desenvolvedor", "TI", "joao@exemplo.com"),
      new Colaborador(2, "Maria Santos", "Analista", "Segurança", "maria@exemplo.com")
    ];
  }

  async store(colaborador: Colaborador): Promise<number> {
    // implementação
    throw new Error("Not implemented");
  }

  async delete(id: number): Promise<boolean> {
    // implementação
    throw new Error("Not implemented");
  }
}

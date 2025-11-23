import { Colaborador } from "../Entity/Colaborador";
import { RepositoryInterface } from "./RepositoryInterface";

export class InMemoryRepository implements RepositoryInterface {
  private colaboradores: Colaborador[] = [
    new Colaborador(1, "Carlos Souza", "Gerente", "Operações", "carlos@exemplo.com"),
    new Colaborador(2, "Ana Lima", "Técnica", "Manutenção", "ana@exemplo.com"),
    new Colaborador(3, "Pedro Costa", "Supervisor", "Segurança", "pedro@exemplo.com")
  ];

  async find(id: number): Promise<Colaborador> {
    const colaborador = this.colaboradores.find(c => c.id === id);
    if (!colaborador) {
      throw new Error(`Colaborador ${id} não encontrado`);
    }
    return colaborador;
  }

  async search(query: string): Promise<Colaborador[]> {
    const lowerQuery = query.toLowerCase();
    return this.colaboradores.filter(c =>
      c.nomeCompleto.toLowerCase().includes(lowerQuery) ||
      c.cargo.toLowerCase().includes(lowerQuery) ||
      c.setor.toLowerCase().includes(lowerQuery)
    );
  }

  async findAll(): Promise<Colaborador[]> {
    return [...this.colaboradores]; // Retorna cópia para evitar mutação
  }

  async store(colaborador: Colaborador): Promise<number> {
    const newId = Math.max(...this.colaboradores.map(c => c.id), 0) + 1;
    const newColaborador = new Colaborador(
      newId,
      colaborador.nomeCompleto,
      colaborador.cargo,
      colaborador.setor,
      colaborador.email
    );
    this.colaboradores.push(newColaborador);
    return newId;
  }

  async delete(id: number): Promise<boolean> {
    const index = this.colaboradores.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.colaboradores.splice(index, 1);
    return true;
  }
}

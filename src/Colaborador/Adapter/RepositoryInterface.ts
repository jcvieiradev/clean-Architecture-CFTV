import { Colaborador } from "../Entity/Colaborador";

export interface RepositoryInterface {
    find(id: number): Promise<Colaborador>;
    search(query: string): Promise<Colaborador[]>;
    findAll(): Promise<Colaborador[]>;
    store(colaborador: Colaborador): Promise<number>;
    delete(id: number): Promise<boolean>;
  }
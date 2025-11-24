// src/colaborador/usecase/Service.ts

import { Colaborador } from "../Entity/Colaborador";
import { RepositoryInterface } from "../Adapter/RepositoryInterface";
import { UseCaseInterface } from "./UseCaseInterface";

export class Service implements UseCaseInterface {
  private reposi
  tory: RepositoryInterface;

  constructor(repository: RepositoryInterface) {
    this.repository = repository;
  }

  async find(id: number): Promise<Colaborador> {
    return this.repository.find(id);
  }

  async search(query: string): Promise<Colaborador[]> {
    return this.repository.search(query);
  }

  async findAll(): Promise<Colaborador[]> {
    return this.repository.findAll();
  }

  async store(colaborador: Colaborador): Promise<number> {
    return this.repository.store(colaborador);
  }

  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }
}

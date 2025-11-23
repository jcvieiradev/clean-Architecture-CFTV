// src/colaborador/controller/IndexHandler.ts

import { Request, Response } from "express";
import { Service } from "../UseCase/Service";


export class IndexHandler {
    
  private service: Service;

  constructor(service: Service) {
    this.service = service;
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const all = await this.service.findAll();
      return res.status(200).json(all);
    } catch (error) {
      console.error('Error fetching colaboradores:', error);
      return res.status(500).json({
        error: 'Erro ao buscar colaboradores',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}

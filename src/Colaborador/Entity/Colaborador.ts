

export class Colaborador {
    constructor(
      public id: number,
      public nomeCompleto: string,
      public cargo: string,
      public setor: string,
      public email: string
    ) {
      this.validate();
    }

    private validate(): void {
      if (!this.nomeCompleto || this.nomeCompleto.trim().length === 0) {
        throw new Error('Nome completo é obrigatório');
      }

      if (!this.cargo || this.cargo.trim().length === 0) {
        throw new Error('Cargo é obrigatório');
      }

      if (!this.setor || this.setor.trim().length === 0) {
        throw new Error('Setor é obrigatório');
      }

      if (!this.email || !this.isValidEmail(this.email)) {
        throw new Error('Email inválido');
      }
    }

    private isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }
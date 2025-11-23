# 📚 Guia Completo - Clean Architecture e POO

## Índice

1. [Introdução à Clean Architecture](#introdução-à-clean-architecture)
2. [Conceitos de Programação Orientada a Objetos](#conceitos-de-programação-orientada-a-objetos)
3. [O que são Classes](#o-que-são-classes)
4. [Constructor - Método de Inicialização](#constructor---método-de-inicialização)
5. [Relacionamento entre Camadas](#relacionamento-entre-camadas)
6. [Injeção de Dependência](#injeção-de-dependência)
7. [Fluxo Completo da Aplicação](#fluxo-completo-da-aplicação)
8. [Boas Práticas](#boas-práticas)

---

## Introdução à Clean Architecture

Clean Architecture é um padrão arquitetural que promove:

- **Separação de responsabilidades** em camadas
- **Independência de frameworks** e bibliotecas
- **Testabilidade** facilitada
- **Manutenibilidade** do código

### Estrutura do Projeto

```
src/
└── Colaborador/
    ├── Entity/              # Camada de Entidades
    │   └── Colaborador.ts   # Regras de negócio + Validações
    ├── UseCase/             # Camada de Casos de Uso
    │   ├── Service.ts       # Lógica de negócio
    │   └── UseCaseInterface.ts
    ├── Adapter/             # Camada de Adaptadores
    │   ├── RepositoryInterface.ts
    │   ├── DatabaseRepository.ts
    │   └── InMemoryRepository.ts
    └── Controller/          # Camada de Controladores
        └── IndexHandler.ts  # Interface com HTTP
```

### Fluxo de Dependências

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  Controller  →  UseCase  →  Repository  →  Entity  │
│                                                     │
│  (HTTP)         (Lógica)    (Dados)       (Regras) │
│                                                     │
└─────────────────────────────────────────────────────┘

Regra de Ouro: Dependências apontam SEMPRE para dentro
```

---

## Conceitos de Programação Orientada a Objetos

### 1. **Encapsulamento**

Ocultar detalhes internos e expor apenas o necessário.

```typescript
export class IndexHandler {
  private service: Service;  // ← PRIVADO: só a classe acessa

  constructor(service: Service) {
    this.service = service;
  }

  // Método PÚBLICO: interface externa
  async handle(req: Request, res: Response): Promise<Response> {
    return res.json(await this.service.findAll());
  }
}
```

**Benefícios:**
- ✅ Controla acesso aos dados
- ✅ Protege integridade do objeto
- ✅ Facilita manutenção

### 2. **Abstração**

Focar no "O QUE" faz, não no "COMO" faz.

```typescript
// Interface define O QUE deve ser feito
export interface RepositoryInterface {
  find(id: number): Promise<Colaborador>;
  findAll(): Promise<Colaborador[]>;
  // Não diz COMO implementar
}

// Implementação define COMO fazer
export class DatabaseRepository implements RepositoryInterface {
  async findAll(): Promise<Colaborador[]> {
    // COMO: consulta SQL, NoSQL, arquivo, etc
  }
}
```

### 3. **Polimorfismo**

Múltiplas implementações da mesma interface.

```typescript
// Mesma interface, implementações diferentes
const repo1 = new DatabaseRepository();
const repo2 = new InMemoryRepository();
const repo3 = new APIRepository();

// Todas podem ser usadas no mesmo lugar
const service = new Service(repo1);  // ✅
const service = new Service(repo2);  // ✅
const service = new Service(repo3);  // ✅
```

### 4. **Composição**

Um objeto "TEM UM" outro objeto (has-a relationship).

```typescript
export class Service {
  private repository: RepositoryInterface;  // Service TEM UM Repository

  constructor(repository: RepositoryInterface) {
    this.repository = repository;
  }
}

export class IndexHandler {
  private service: Service;  // IndexHandler TEM UM Service

  constructor(service: Service) {
    this.service = service;
  }
}
```

---

## O que são Classes

### Definição

Uma classe é um **modelo/blueprint** para criar objetos. Define:

- **Atributos** (dados/estado)
- **Métodos** (comportamentos/ações)

### Anatomia de uma Classe

```typescript
export class Colaborador {                  // ← DECLARAÇÃO

  // ATRIBUTOS (dados do objeto)
  public id: number;
  public nomeCompleto: string;
  public cargo: string;

  // CONSTRUCTOR (inicialização)
  constructor(
    id: number,
    nomeCompleto: string,
    cargo: string
  ) {
    this.id = id;
    this.nomeCompleto = nomeCompleto;
    this.cargo = cargo;
    this.validate();
  }

  // MÉTODOS PÚBLICOS (interface externa)
  public getNomeCompleto(): string {
    return this.nomeCompleto;
  }

  // MÉTODOS PRIVADOS (lógica interna)
  private validate(): void {
    if (!this.nomeCompleto) {
      throw new Error('Nome obrigatório');
    }
  }
}
```

### Criando Objetos (Instâncias)

```typescript
// Sintaxe: new NomeDaClasse(argumentos)
const colaborador1 = new Colaborador(1, "João Silva", "Desenvolvedor");
const colaborador2 = new Colaborador(2, "Maria Santos", "Analista");

// Cada objeto é INDEPENDENTE na memória
console.log(colaborador1.id);  // 1
console.log(colaborador2.id);  // 2
```

### Memória

```
┌─────────────────────────────────────────────┐
│             MEMÓRIA RAM                     │
├─────────────────────────────────────────────┤
│                                             │
│  colaborador1  →  {                         │
│                     id: 1,                  │
│                     nomeCompleto: "João",   │
│                     cargo: "Dev"            │
│                   }                         │
│                                             │
│  colaborador2  →  {                         │
│                     id: 2,                  │
│                     nomeCompleto: "Maria",  │
│                     cargo: "Analista"       │
│                   }                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Constructor - Método de Inicialização

### O que é Constructor?

O **constructor** é um **método especial** executado **automaticamente** quando você cria um objeto com `new`.

### Funções do Constructor

1. **Inicializar atributos** do objeto
2. **Validar dados** recebidos
3. **Executar configurações** iniciais
4. **Preparar o objeto** para uso

### Sintaxe Básica

```typescript
export class Colaborador {
  // Atributos
  id: number;
  nomeCompleto: string;

  // Constructor
  constructor(id: number, nomeCompleto: string) {
    this.id = id;                    // Inicializa atributos
    this.nomeCompleto = nomeCompleto;
    this.validate();                 // Executa validação
  }

  private validate(): void {
    if (!this.nomeCompleto) {
      throw new Error('Nome obrigatório');
    }
  }
}
```

### Atalho do TypeScript (Parameter Properties)

TypeScript oferece um **atalho poderoso**:

**❌ Forma Longa (JavaScript tradicional):**

```typescript
export class Colaborador {
  // 1. Declarar atributos
  id: number;
  nomeCompleto: string;
  cargo: string;

  constructor(id: number, nomeCompleto: string, cargo: string) {
    // 2. Atribuir valores manualmente
    this.id = id;
    this.nomeCompleto = nomeCompleto;
    this.cargo = cargo;
  }
}
```

**✅ Forma Curta (TypeScript):**

```typescript
export class Colaborador {
  constructor(
    public id: number,           // ← Declara + Atribui automaticamente
    public nomeCompleto: string,
    public cargo: string
  ) {
    // Já está tudo pronto!
  }
}
```

### Modificadores de Acesso

#### `public` - Público

```typescript
constructor(
  public id: number  // ← Acessível de qualquer lugar
)

// Uso:
const colaborador = new Colaborador(1, "João", "Dev");
console.log(colaborador.id);  // ✅ Funciona!
colaborador.id = 2;            // ✅ Pode modificar
```

#### `private` - Privado

```typescript
constructor(
  private senha: string  // ← Só acessível DENTRO da classe
)

// Uso:
const colaborador = new Colaborador("123456");
console.log(colaborador.senha);  // ❌ ERRO: Property is private
```

#### `readonly` - Somente Leitura

```typescript
constructor(
  public readonly id: number  // ← Pode ler, NÃO pode modificar
)

// Uso:
const colaborador = new Colaborador(1, "João", "Dev");
console.log(colaborador.id);  // ✅ Funciona!
colaborador.id = 2;            // ❌ ERRO: Cannot assign to readonly
```

### Fluxo de Execução do Constructor

```typescript
const colaborador = new Colaborador(1, "João Silva", "Dev", "TI", "joao@exemplo.com");
```

**O que acontece internamente:**

```
┌──────────────────────────────────────────────────────┐
│ PASSO A PASSO DA EXECUÇÃO                            │
└──────────────────────────────────────────────────────┘

1. new Colaborador(...)
   ↓ Cria um objeto vazio em memória

2. Executa o constructor:
   ↓ Atribui valores aos atributos

   this.id = 1
   this.nomeCompleto = "João Silva"
   this.cargo = "Dev"
   this.setor = "TI"
   this.email = "joao@exemplo.com"

3. Executa o corpo do constructor:
   ↓ this.validate()

   Valida:
   - Nome completo? ✅
   - Cargo? ✅
   - Setor? ✅
   - Email válido? ✅

4. Se TUDO OK:
   ↓ Retorna o objeto criado

   Se FALHAR:
   ↓ Lança Error
   ↓ Objeto NÃO É CRIADO
```

### Validação no Constructor

```typescript
export class Colaborador {
  constructor(
    public id: number,
    public nomeCompleto: string,
    public cargo: string,
    public setor: string,
    public email: string
  ) {
    this.validate();  // ← Valida ANTES de finalizar
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
```

**Teste:**

```typescript
// ✅ Dados válidos - objeto criado
const colaborador1 = new Colaborador(
  1,
  "João Silva",
  "Dev",
  "TI",
  "joao@exemplo.com"
);
console.log(colaborador1);  // Funciona!

// ❌ Email inválido - ERRO, objeto NÃO criado
try {
  const colaborador2 = new Colaborador(
    2,
    "Maria",
    "Analista",
    "RH",
    "email-invalido"  // ← SEM @
  );
} catch (error) {
  console.error(error.message);  // "Email inválido"
}
```

### A Palavra-chave `this`

`this` refere-se ao **objeto atual** sendo criado/manipulado.

```typescript
constructor(
  public id: number,
  public nomeCompleto: string
) {
  this.validate();  // ← "this" = objeto sendo criado
  //  ^^^^
}

private validate(): void {
  if (!this.nomeCompleto || this.nomeCompleto.trim().length === 0) {
  //   ^^^^                  ^^^^
  // "this" aponta para o objeto atual
    throw new Error('Nome completo é obrigatório');
  }
}
```

**Exemplo:**

```typescript
const joao = new Colaborador(1, "João", "Dev", "TI", "joao@exemplo.com");
// Dentro do constructor, "this" = joao

const maria = new Colaborador(2, "Maria", "Analista", "RH", "maria@exemplo.com");
// Dentro do constructor, "this" = maria
```

---

## Relacionamento entre Camadas

### Princípio da Composição

Cada camada **TEM UM** (has-a) instância da camada seguinte.

```typescript
// Controller TEM UM Service
export class IndexHandler {
  private service: Service;  // ← COMPOSIÇÃO

  constructor(service: Service) {
    this.service = service;
  }
}

// Service TEM UM Repository
export class Service {
  private repository: RepositoryInterface;  // ← COMPOSIÇÃO

  constructor(repository: RepositoryInterface) {
    this.repository = repository;
  }
}
```

### Como uma Classe Chama a Outra

```typescript
// src/Colaborador/Controller/IndexHandler.ts
export class IndexHandler {
  private service: Service;

  constructor(service: Service) {
    this.service = service;
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const all = await this.service.findAll();  // ← Chama o Service
      //                ^^^^^^^^^^^^
      return res.status(200).json(all);
    } catch (error) {
      return res.status(500).json({ error: 'Erro' });
    }
  }
}
```

```typescript
// src/Colaborador/UseCase/Service.ts
export class Service {
  private repository: RepositoryInterface;

  constructor(repository: RepositoryInterface) {
    this.repository = repository;
  }

  async findAll(): Promise<Colaborador[]> {
    return this.repository.findAll();  // ← Chama o Repository
    //     ^^^^^^^^^^^^^^^^^^^^
  }
}
```

```typescript
// src/Colaborador/Adapter/DatabaseRepository.ts
export class DatabaseRepository implements RepositoryInterface {
  async findAll(): Promise<Colaborador[]> {
    // Consulta banco de dados
    return [
      new Colaborador(1, "João", "Dev", "TI", "joao@exemplo.com"),
      new Colaborador(2, "Maria", "Analista", "RH", "maria@exemplo.com")
    ];
  }
}
```

### Fluxo de uma Requisição HTTP

```
┌──────────────────────────────────────────────────────────┐
│ FLUXO COMPLETO: GET /colaboradores                       │
└──────────────────────────────────────────────────────────┘

HTTP Request
    ↓
indexHandler.handle(req, res)
    ↓
    └─→ this.service.findAll()        ← Chama Service
            ↓
            └─→ this.repository.findAll()    ← Chama Repository
                    ↓
                    └─→ SELECT * FROM colaboradores
                            ↓
                        [Dados do Banco]
                            ↓
                        new Colaborador(...)    ← Cria Entities
                            ↓
                    return [colaboradores]
                ↓
            return [colaboradores]
        ↓
    return res.json([colaboradores])
        ↓
HTTP Response (JSON)
```

### Isolamento entre Camadas

#### 1. **Encapsulamento (Private)**

```typescript
export class IndexHandler {
  private service: Service;  // ← PRIVADO
  //      ^^^^^^^
}

// ❌ IMPOSSÍVEL fazer de fora:
indexHandler.service.findAll();  // Erro: 'service' is private

// ✅ CORRETO:
indexHandler.handle(req, res);  // Usa método público
```

#### 2. **Abstração (Interface)**

```typescript
// Service depende da INTERFACE, não da implementação
export class Service {
  private repository: RepositoryInterface;  // ← INTERFACE
  //                  ^^^^^^^^^^^^^^^^^^^

  constructor(repository: RepositoryInterface) {
    this.repository = repository;
  }
}

// Pode trocar a implementação facilmente:
const service1 = new Service(new DatabaseRepository());
const service2 = new Service(new InMemoryRepository());
const service3 = new Service(new APIRepository());
// Service não sabe nem liga qual está usando!
```

#### 3. **Inversão de Dependência**

Depender de **abstrações** (interfaces), não de **implementações** (classes concretas).

```typescript
// ❌ SEM Inversão de Dependência (RUIM)
export class Service {
  private repository: DatabaseRepository;  // ← Classe concreta

  constructor() {
    this.repository = new DatabaseRepository();  // ← Acoplado!
  }
}

// ✅ COM Inversão de Dependência (BOM)
export class Service {
  private repository: RepositoryInterface;  // ← Interface

  constructor(repository: RepositoryInterface) {
    this.repository = repository;  // ← Desacoplado!
  }
}
```

---

## Injeção de Dependência

### O que é?

**Injeção de Dependência** é fornecer as dependências de uma classe **de fora** (pelo constructor), ao invés de criar internamente.

### Comparação

#### ❌ SEM Injeção de Dependência (Acoplado)

```typescript
export class IndexHandler {
  private service: Service;

  constructor() {
    // Cria a dependência INTERNAMENTE
    this.service = new Service(new DatabaseRepository());
    // ↑ RUIM: Acoplado, difícil testar, difícil trocar
  }
}
```

**Problemas:**
- ❌ Difícil de testar (não pode mockar o Service)
- ❌ Difícil de trocar implementação
- ❌ Violação do princípio de responsabilidade única
- ❌ Acoplamento forte

#### ✅ COM Injeção de Dependência (Desacoplado)

```typescript
export class IndexHandler {
  private service: Service;

  constructor(service: Service) {
    // Recebe a dependência de FORA
    this.service = service;
    // ↑ BOM: Desacoplado, fácil testar, fácil trocar
  }
}
```

**Benefícios:**
- ✅ Fácil de testar (pode passar Mock)
- ✅ Fácil de trocar implementação
- ✅ Responsabilidade única respeitada
- ✅ Baixo acoplamento

### Montagem do Grafo de Objetos

A montagem acontece em um **único lugar** (normalmente `server.ts`):

```typescript
// src/server.ts

// 1. Criar Repository (camada mais interna)
const repository = new DatabaseRepository();

// 2. Criar Service e INJETAR Repository
const service = new Service(repository);
//                          ^^^^^^^^^^
//                          Injeção!

// 3. Criar Controller e INJETAR Service
const indexHandler = new IndexHandler(service);
//                                    ^^^^^^^
//                                    Injeção!

// 4. Usar no Express
app.get('/colaboradores', (req, res) => indexHandler.handle(req, res));
```

### Vantagens para Testes

```typescript
// Mock do Repository para teste
class MockRepository implements RepositoryInterface {
  async findAll(): Promise<Colaborador[]> {
    return [
      new Colaborador(1, "Teste", "Teste", "Teste", "teste@teste.com")
    ];
  }
}

// No teste unitário
describe('Service', () => {
  it('deve retornar colaboradores', async () => {
    const mockRepo = new MockRepository();
    const service = new Service(mockRepo);  // ← Injeta o Mock

    const result = await service.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].nomeCompleto).toBe("Teste");
  });
});
```

### Trocando Implementações

Trocar de `DatabaseRepository` para `InMemoryRepository`:

```typescript
// ANTES
const repository = new DatabaseRepository();
const service = new Service(repository);

// DEPOIS - Só muda UMA LINHA!
const repository = new InMemoryRepository();
const service = new Service(repository);

// TODO O RESTO permanece IGUAL!
const indexHandler = new IndexHandler(service);
app.get('/colaboradores', (req, res) => indexHandler.handle(req, res));
```

---

## Fluxo Completo da Aplicação

### 1. Bootstrap (Inicialização)

```typescript
// src/server.ts

import express from 'express';
import { IndexHandler } from './Colaborador/Controller/IndexHandler';
import { Service } from './Colaborador/UseCase/Service';
import { DatabaseRepository } from './Colaborador/Adapter/DatabaseRepository';

const app = express();

// Middlewares
app.use(express.json());

// ┌────────────────────────────────────────────────┐
// │ DEPENDENCY INJECTION (Montagem do Grafo)      │
// └────────────────────────────────────────────────┘

// Camada de dados
const repository = new DatabaseRepository();

// Camada de lógica (injeta repository)
const service = new Service(repository);

// Camada de controle (injeta service)
const indexHandler = new IndexHandler(service);

// Rotas
app.get('/colaboradores', (req, res) => indexHandler.handle(req, res));

// Servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
```

### 2. Requisição HTTP

```
┌──────────────────────────────────────────────────────────────┐
│ FLUXO DETALHADO                                              │
└──────────────────────────────────────────────────────────────┘

1. Cliente HTTP
   ↓ GET /colaboradores

2. Express Router
   ↓ Encontra rota

3. IndexHandler.handle(req, res)
   ↓ Método async handle é chamado

4. await this.service.findAll()
   ↓ IndexHandler chama Service

5. Service.findAll()
   ↓ return this.repository.findAll()

6. DatabaseRepository.findAll()
   ↓ Consulta banco de dados / retorna mock
   ↓ return [new Colaborador(...), new Colaborador(...)]

7. Colaborador constructor é executado
   ↓ Valida dados
   ↓ Se OK: cria objeto
   ↓ Se ERRO: lança exception

8. Array de Colaboradores retorna para Service
   ↓ return [colaboradores]

9. Service retorna para Controller
   ↓ return [colaboradores]

10. Controller formata resposta
    ↓ res.status(200).json(all)

11. Express serializa JSON
    ↓ Converte objetos para JSON

12. HTTP Response
    ↓ Status 200
    ↓ Body: [{"id":1,"nomeCompleto":"João",...}]
```

### 3. Diagrama Visual

```
┌────────────────────────────────────────────────────────┐
│                   CAMADAS DA APLICAÇÃO                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────┐     │
│  │  HTTP Request (GET /colaboradores)           │     │
│  └─────────────────┬────────────────────────────┘     │
│                    ↓                                   │
│  ┌──────────────────────────────────────────────┐     │
│  │  CONTROLLER (IndexHandler)                   │     │
│  │  - Recebe requisição HTTP                    │     │
│  │  - Valida entrada                            │     │
│  │  - Chama UseCase                             │     │
│  │  - Formata resposta                          │     │
│  └─────────────────┬────────────────────────────┘     │
│                    ↓ this.service.findAll()           │
│  ┌──────────────────────────────────────────────┐     │
│  │  USE CASE (Service)                          │     │
│  │  - Lógica de negócio                         │     │
│  │  - Orquestra operações                       │     │
│  │  - Chama Repository                          │     │
│  └─────────────────┬────────────────────────────┘     │
│                    ↓ this.repository.findAll()        │
│  ┌──────────────────────────────────────────────┐     │
│  │  REPOSITORY (DatabaseRepository)             │     │
│  │  - Acesso a dados                            │     │
│  │  - Consultas ao banco                        │     │
│  │  - Cria Entities                             │     │
│  └─────────────────┬────────────────────────────┘     │
│                    ↓ new Colaborador(...)             │
│  ┌──────────────────────────────────────────────┐     │
│  │  ENTITY (Colaborador)                        │     │
│  │  - Regras de negócio                         │     │
│  │  - Validações                                │     │
│  │  - Dados do domínio                          │     │
│  └─────────────────┬────────────────────────────┘     │
│                    ↓                                   │
│  ┌──────────────────────────────────────────────┐     │
│  │  HTTP Response (JSON)                        │     │
│  └──────────────────────────────────────────────┘     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## Boas Práticas

### ✅ FAÇA

#### 1. Use Constructor para Inicialização

```typescript
constructor(public id: number, public nome: string) {
  this.validate();  // ✅ Validar na criação
}
```

#### 2. Injete Dependências pelo Constructor

```typescript
constructor(private repository: RepositoryInterface) {
  this.repository = repository;  // ✅ Injeção de dependência
}
```

#### 3. Dependa de Interfaces, não de Implementações

```typescript
// ✅ BOM
private repository: RepositoryInterface;

// ❌ RUIM
private repository: DatabaseRepository;
```

#### 4. Use Modificadores Apropriados

```typescript
constructor(
  public id: number,          // ✅ Público para dados da entidade
  private senha: string,      // ✅ Privado para dados sensíveis
  public readonly cpf: string // ✅ Readonly para dados imutáveis
) {}
```

#### 5. Valide no Constructor

```typescript
constructor(public email: string) {
  if (!this.isValidEmail(email)) {
    throw new Error('Email inválido');  // ✅ Falha rápido
  }
}
```

#### 6. Mantenha Atributos Privados

```typescript
export class Service {
  private repository: RepositoryInterface;  // ✅ Privado

  // Exponha apenas métodos públicos necessários
  public async findAll(): Promise<Colaborador[]> {
    return this.repository.findAll();
  }
}
```

### ❌ NÃO FAÇA

#### 1. Lógica Complexa no Constructor

```typescript
constructor(public id: number) {
  // ❌ NÃO fazer chamadas assíncronas
  this.fetchDataFromAPI();

  // ❌ NÃO fazer processamento pesado
  this.calculateComplexAlgorithm();

  // ✅ APENAS inicialização e validação simples
}
```

#### 2. Criar Dependências Internamente

```typescript
// ❌ RUIM: Criando dependência internamente
constructor() {
  this.repository = new DatabaseRepository();
}

// ✅ BOM: Recebendo por injeção
constructor(repository: RepositoryInterface) {
  this.repository = repository;
}
```

#### 3. Expor Atributos Desnecessariamente

```typescript
// ❌ RUIM: Tudo público
export class Service {
  public repository: RepositoryInterface;  // ❌ Exposto!
}

// ✅ BOM: Privado quando possível
export class Service {
  private repository: RepositoryInterface;  // ✅ Encapsulado
}
```

#### 4. Violar o Princípio de Responsabilidade Única

```typescript
// ❌ RUIM: Service fazendo TUDO
export class Service {
  async findAll() {
    // ❌ Acessando banco diretamente
    const sql = "SELECT * FROM colaboradores";
    const result = await database.query(sql);

    // ❌ Validando HTTP
    if (!req.headers.authorization) {
      throw new Error('Não autorizado');
    }

    return result;
  }
}

// ✅ BOM: Cada camada com sua responsabilidade
export class Service {
  async findAll() {
    // ✅ Apenas lógica de negócio
    return this.repository.findAll();
  }
}
```

---

## Resumo

### Conceitos Principais

```
┌──────────────────────────────────────────────────────────┐
│              CONCEITOS FUNDAMENTAIS                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📘 CLASSE                                               │
│     ├─ Blueprint para criar objetos                     │
│     ├─ Define atributos + métodos                       │
│     └─ Instanciada com "new"                            │
│                                                          │
│  🏗️ CONSTRUCTOR                                         │
│     ├─ Método especial de inicialização                 │
│     ├─ Executado automaticamente com "new"              │
│     ├─ Inicializa atributos                             │
│     ├─ Valida dados                                     │
│     └─ Recebe dependências (Injeção)                    │
│                                                          │
│  🔧 MODIFICADORES                                        │
│     ├─ public    → Acessível de qualquer lugar          │
│     ├─ private   → Acessível só dentro da classe        │
│     └─ readonly  → Somente leitura após inicialização   │
│                                                          │
│  🎯 THIS                                                 │
│     └─ Referência ao objeto atual                       │
│                                                          │
│  🔗 COMPOSIÇÃO                                          │
│     └─ Um objeto "TEM UM" outro objeto                  │
│                                                          │
│  💉 INJEÇÃO DE DEPENDÊNCIA                              │
│     └─ Dependências vêm de FORA (constructor)           │
│                                                          │
│  🔄 INVERSÃO DE DEPENDÊNCIA                             │
│     └─ Depender de abstrações (interfaces)              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Estrutura de Camadas

```
Controller  →  UseCase  →  Repository  →  Entity
   ↓             ↓            ↓             ↓
  HTTP        Lógica       Dados        Regras

Regra: Dependências sempre apontam para DENTRO
```

### Benefícios da Arquitetura

- ✅ **Testabilidade**: Fácil criar mocks
- ✅ **Manutenibilidade**: Mudanças isoladas
- ✅ **Escalabilidade**: Adicionar features sem quebrar
- ✅ **Flexibilidade**: Trocar implementações facilmente
- ✅ **Clareza**: Responsabilidades bem definidas

---

## Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**Criado para o projeto Clean Architecture CFTV**
*Última atualização: 2025-11-23*

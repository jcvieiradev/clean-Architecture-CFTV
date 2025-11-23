# 🔍 Como Uma Classe Chama a Outra - Exemplo Prático

## O Segredo: ATRIBUTOS guardam OBJETOS

Quando você faz isso:

```typescript
export class IndexHandler {
  private service: Service;  // ← Este é um ATRIBUTO que GUARDA um objeto Service

  constructor(service: Service) {
    this.service = service;  // ← Guardando o objeto no atributo
  }
}
```

**O que está acontecendo:**

```
┌─────────────────────────────────────────────────────┐
│  IndexHandler (objeto na memória)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  service: ───────┐                                  │
│                  │                                  │
└──────────────────┼──────────────────────────────────┘
                   │
                   │ (referência/ponteiro)
                   │
                   ↓
         ┌─────────────────────────┐
         │  Service (objeto)       │
         │  repository: ────────┐  │
         └──────────────────────┼──┘
                                │
                                ↓
                      ┌──────────────────────┐
                      │  Repository (objeto) │
                      └──────────────────────┘
```

---

## 📝 Exemplo Completo Passo a Passo

Vou criar um exemplo SUPER SIMPLES para você entender:

### Passo 1: Criar as Classes

```typescript
// Classe A: Calculadora
class Calculadora {
  somar(a: number, b: number): number {
    console.log(`Calculadora: somando ${a} + ${b}`);
    return a + b;
  }
}

// Classe B: Caixa Registradora
class CaixaRegistradora {
  private calculadora: Calculadora;  // ← ATRIBUTO que guarda um objeto Calculadora
  //                  ^^^^^^^^^^^^ Tipo

  constructor(calculadora: Calculadora) {
    this.calculadora = calculadora;  // ← Guarda o objeto recebido
    console.log("CaixaRegistradora criada com uma Calculadora");
  }

  // Método que USA a calculadora
  calcularTotal(preco1: number, preco2: number): number {
    console.log("CaixaRegistradora: vou chamar a Calculadora...");

    // AQUI ESTÁ A MÁGICA! ↓
    const total = this.calculadora.somar(preco1, preco2);
    //            ^^^^^^^^^^^^^^^^^^^^
    //            Chamando o método somar() do objeto Calculadora

    console.log(`CaixaRegistradora: total calculado = ${total}`);
    return total;
  }
}
```

### Passo 2: Criar os Objetos e Conectá-los

```typescript
// 1. Criar uma Calculadora
const minhaCalculadora = new Calculadora();
console.log("✅ Calculadora criada");

// 2. Criar uma Caixa Registradora e DAR a calculadora para ela
const minhaCaixa = new CaixaRegistradora(minhaCalculadora);
//                                       ^^^^^^^^^^^^^^^^
//                                       Passando o objeto!
console.log("✅ Caixa criada e recebeu a Calculadora");

// 3. Usar a Caixa (que internamente usa a Calculadora)
const resultado = minhaCaixa.calcularTotal(10, 20);
console.log(`✅ Resultado final: ${resultado}`);
```

### Passo 3: O que acontece quando roda?

```
Console:
✅ Calculadora criada
CaixaRegistradora criada com uma Calculadora
✅ Caixa criada e recebeu a Calculadora
CaixaRegistradora: vou chamar a Calculadora...
Calculadora: somando 10 + 20
CaixaRegistradora: total calculado = 30
✅ Resultado final: 30
```

### Diagrama do Fluxo:

```
┌──────────────────────────────────────────────────────────┐
│ PASSO A PASSO DA EXECUÇÃO                                │
└──────────────────────────────────────────────────────────┘

1. const minhaCalculadora = new Calculadora();
   ↓
   Cria objeto Calculadora na memória

   [Calculadora: { somar: function }]


2. const minhaCaixa = new CaixaRegistradora(minhaCalculadora);
   ↓
   Cria objeto CaixaRegistradora
   ↓
   Executa constructor(calculadora)
   ↓
   this.calculadora = calculadora  ← Guarda a REFERÊNCIA

   [CaixaRegistradora: {
     calculadora: ────→ [Calculadora: { somar: function }]
   }]


3. minhaCaixa.calcularTotal(10, 20)
   ↓
   Entra no método calcularTotal
   ↓
   this.calculadora.somar(10, 20)  ← CHAMADA!
   ↓
   Vai até o objeto Calculadora
   ↓
   Executa o método somar(10, 20)
   ↓
   return 30
```

---

## 🎬 Aplicando no SEU Código

Agora vamos ver exatamente no seu código:

### Arquivo: IndexHandler.ts

```typescript
export class IndexHandler {
  private service: Service;  // ← 1. DECLARAÇÃO: "Vou guardar um objeto Service aqui"

  constructor(service: Service) {  // ← 2. RECEBIMENTO: Recebe o objeto
    this.service = service;  // ← 3. ARMAZENAMENTO: Guarda no atributo
    //  ^^^^        ^^^^^^^
    //  atributo    objeto recebido
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // 4. USO: Chama o método do objeto guardado
      const all = await this.service.findAll();
      //                ^^^^^^^^^^^^
      //                Acessa o atributo que guarda o Service
      //                              ^^^^^^^^
      //                              Chama o método do Service

      return res.status(200).json(all);
    } catch (error) {
      return res.status(500).json({ error: 'Erro' });
    }
  }
}
```

### Traduzindo para Português Claro:

```typescript
// 1. DECLARAÇÃO
private service: Service;
// "Eu tenho uma gaveta chamada 'service' que guarda um objeto do tipo Service"

// 2. RECEBIMENTO + ARMAZENAMENTO
constructor(service: Service) {
  this.service = service;
}
// "Quando me criarem, me deem um objeto Service, que eu vou guardar na gaveta"

// 3. USO
const all = await this.service.findAll();
// "Vou abrir a gaveta 'service', pegar o objeto Service que está lá dentro,
//  e chamar o método findAll() dele"
```

---

## 🔗 Como Conectar Tudo (server.ts)

```typescript
// src/server.ts

// PASSO 1: Criar o Repository (objeto mais interno)
const repository = new DatabaseRepository();
console.log("Repository criado:", repository);
// Memória: [DatabaseRepository: { find: function, findAll: function, ... }]


// PASSO 2: Criar o Service e DAR o repository para ele
const service = new Service(repository);
//                          ^^^^^^^^^^
//                          Passando o objeto repository!

console.log("Service criado:", service);
// Memória: [Service: {
//   repository: ────→ [DatabaseRepository: { ... }]
// }]


// PASSO 3: Criar o IndexHandler e DAR o service para ele
const indexHandler = new IndexHandler(service);
//                                    ^^^^^^^
//                                    Passando o objeto service!

console.log("IndexHandler criado:", indexHandler);
// Memória: [IndexHandler: {
//   service: ────→ [Service: {
//     repository: ────→ [DatabaseRepository: { ... }]
//   }]
// }]


// PASSO 4: Quando chega uma requisição HTTP
app.get('/colaboradores', (req, res) => {
  indexHandler.handle(req, res);
  // ↓
  // Entra no método handle() do IndexHandler
  // ↓
  // this.service.findAll()
  // ↓
  // Pega o objeto Service guardado no atributo
  // ↓
  // Chama findAll() do Service
  // ↓
  // Dentro do Service: this.repository.findAll()
  // ↓
  // Pega o objeto Repository guardado no atributo
  // ↓
  // Chama findAll() do Repository
});
```

---

## 🎨 Visualização na Memória

Quando você executa o código acima, a memória fica assim:

```
MEMÓRIA RAM:
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  repository = {                                          │
│    __proto__: DatabaseRepository                         │
│    find: function(id) { ... }                            │
│    findAll: function() { ... }                           │
│    store: function(colaborador) { ... }                  │
│  }                                                       │
│    ↑                                                     │
│    │                                                     │
│    │ (referência)                                        │
│    │                                                     │
│  service = {                                             │
│    __proto__: Service                                    │
│    repository: ───────────┘ (aponta para o objeto acima)│
│    find: function(id) { ... }                            │
│    findAll: function() { ... }                           │
│  }                                                       │
│    ↑                                                     │
│    │                                                     │
│    │ (referência)                                        │
│    │                                                     │
│  indexHandler = {                                        │
│    __proto__: IndexHandler                               │
│    service: ──────────────┘ (aponta para o objeto acima)│
│    handle: function(req, res) { ... }                    │
│  }                                                       │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 💡 A Chave para Entender

### Conceito 1: Atributos guardam REFERÊNCIAS

```typescript
private service: Service;
```

Isso NÃO cria um objeto Service. Isso cria uma "gaveta" que VAI guardar uma referência para um objeto Service.

### Conceito 2: Constructor RECEBE e GUARDA o objeto

```typescript
constructor(service: Service) {
  this.service = service;
}
```

Quando alguém cria o IndexHandler, PRECISA passar um objeto Service.
O constructor pega esse objeto e guarda na "gaveta" (atributo).

### Conceito 3: Métodos USAM o objeto guardado

```typescript
async handle(req: Request, res: Response) {
  const all = await this.service.findAll();
  //                ^^^^^^^^^^^^
  //                Vai na "gaveta" e pega o objeto
  //                              ^^^^^^^^
  //                              Chama método do objeto
}
```

Quando você escreve `this.service`, está dizendo:
- "Vai na minha gaveta chamada 'service'"
- "Pega o objeto que está lá"

Quando você escreve `.findAll()`, está dizendo:
- "Chama o método findAll() desse objeto"

---

## 🎯 Exemplo Super Resumido

```typescript
// 1. Criar objetos
const a = new ClasseA();
const b = new ClasseB(a);  // ← B recebe A e guarda

// 2. Usar
b.fazerAlgo();

// Dentro de ClasseB:
class ClasseB {
  private classeA: ClasseA;

  constructor(classeA: ClasseA) {
    this.classeA = classeA;  // ← Guarda
  }

  fazerAlgo() {
    this.classeA.metodo();  // ← Usa o objeto guardado
    //  ^^^^^^^^ vai na gaveta
    //           ^^^^^^ chama método
  }
}
```

---

## 🔍 Teste Prático - Execute Este Código

Crie um arquivo de teste:

```typescript
// teste.ts

class Impressora {
  imprimir(texto: string) {
    console.log(`🖨️  Imprimindo: ${texto}`);
  }
}

class Escritorio {
  private impressora: Impressora;  // ← Gaveta para guardar Impressora

  constructor(impressora: Impressora) {
    console.log("📋 Escritório recebeu uma impressora");
    this.impressora = impressora;  // ← Guardando na gaveta
  }

  imprimirDocumento(documento: string) {
    console.log("📄 Escritório: preciso imprimir um documento");
    console.log("📄 Escritório: vou chamar a impressora...");

    // AQUI ESTÁ A CHAMADA! ↓
    this.impressora.imprimir(documento);
    //  ^^^^^^^^^^^ pega da gaveta
    //              ^^^^^^^^ chama método

    console.log("✅ Documento impresso!");
  }
}

// Executar:
const minhaImpressora = new Impressora();
const meuEscritorio = new Escritorio(minhaImpressora);
meuEscritorio.imprimirDocumento("Relatório Mensal");
```

**Saída:**
```
📋 Escritório recebeu uma impressora
📄 Escritório: preciso imprimir um documento
📄 Escritório: vou chamar a impressora...
🖨️  Imprimindo: Relatório Mensal
✅ Documento impresso!
```

---

## 🎬 Fluxo Visual Completo

```
╔══════════════════════════════════════════════════════════╗
║  COMO INDEXHANDLER CHAMA SERVICE                         ║
╚══════════════════════════════════════════════════════════╝

1️⃣ CRIAÇÃO DOS OBJETOS (server.ts)

   const repository = new DatabaseRepository();
   ↓ Cria Repository

   const service = new Service(repository);
   ↓ Cria Service
   ↓ Service guarda repository no atributo

   const indexHandler = new IndexHandler(service);
   ↓ Cria IndexHandler
   ↓ IndexHandler guarda service no atributo


2️⃣ REQUISIÇÃO HTTP CHEGA

   GET /colaboradores
   ↓
   indexHandler.handle(req, res)


3️⃣ DENTRO DO MÉTODO handle()

   async handle(req: Request, res: Response) {
     const all = await this.service.findAll();
                       ^^^^^^^^^^^^
                       ↓
                   ┌───┘
                   │
                   └─→ "this" = IndexHandler atual
                       "service" = atributo onde está guardado o Service
                       ↓
                       Vai até o objeto Service guardado
                       ↓
                       Chama o método findAll() dele


4️⃣ DENTRO DO SERVICE.findAll()

   async findAll() {
     return this.repository.findAll();
            ^^^^^^^^^^^^^^^
            ↓
        ┌───┘
        │
        └─→ "this" = Service atual
            "repository" = atributo onde está guardado o Repository
            ↓
            Vai até o objeto Repository guardado
            ↓
            Chama o método findAll() dele


5️⃣ REPOSITORY RETORNA OS DADOS

   ← [Colaborador, Colaborador, ...]
   ↓
   Service recebe e retorna
   ↓
   IndexHandler recebe
   ↓
   res.json(all)
   ↓
   HTTP Response
```

---

## 💭 Resumo Final

**A resposta para "Como uma classe chama a outra?":**

1. A classe **guarda** um objeto em um **atributo**
2. O objeto é **recebido** no **constructor**
3. A classe **usa** o objeto através do atributo com `this.atributo.metodo()`

**Exemplo:**

```typescript
class A {
  private b: B;           // ← 1. Guarda

  constructor(b: B) {
    this.b = b;           // ← 2. Recebe
  }

  fazerAlgo() {
    this.b.metodo();      // ← 3. Usa
  }
}
```

**É como ter uma caixa de ferramentas:**
- A "caixa" é a classe (IndexHandler)
- A "ferramenta" é o objeto guardado (Service)
- Você abre a caixa (`this.service`) e usa a ferramenta (`.findAll()`)

---

**Entendeu agora? Se ainda tiver dúvida, me diga qual parte específica não ficou clara!**

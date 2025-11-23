// TESTE PRÁTICO - Como uma classe chama a outra

// ========================================
// EXEMPLO 1: SUPER SIMPLES
// ========================================

console.log("\n=== EXEMPLO 1: Calculadora e Caixa ===\n");

class Calculadora {
  somar(a: number, b: number): number {
    console.log(`  🔢 Calculadora: somando ${a} + ${b}`);
    return a + b;
  }
}

class CaixaRegistradora {
  private calculadora: Calculadora;  // ← ATRIBUTO que guarda objeto

  constructor(calculadora: Calculadora) {
    this.calculadora = calculadora;  // ← GUARDA o objeto
    console.log("  💰 CaixaRegistradora criada");
  }

  calcularTotal(preco1: number, preco2: number): number {
    console.log("  💰 CaixaRegistradora: vou chamar a Calculadora...");

    // ⭐ AQUI ESTÁ A CHAMADA! ⭐
    const total = this.calculadora.somar(preco1, preco2);
    //            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //            Vai no atributo e chama o método

    console.log(`  💰 Total: ${total}`);
    return total;
  }
}

// Criar e conectar
const calc = new Calculadora();
const caixa = new CaixaRegistradora(calc);  // ← Passa o objeto!
caixa.calcularTotal(10, 20);


// ========================================
// EXEMPLO 2: IGUAL AO SEU CÓDIGO
// ========================================

console.log("\n=== EXEMPLO 2: Simulando seu código ===\n");

class FakeColaborador {
  constructor(
    public id: number,
    public nome: string
  ) {
    console.log(`    👤 Colaborador criado: ${nome}`);
  }
}

class FakeRepository {
  findAll(): FakeColaborador[] {
    console.log("    💾 Repository: buscando dados...");
    return [
      new FakeColaborador(1, "João"),
      new FakeColaborador(2, "Maria")
    ];
  }
}

class FakeService {
  private repository: FakeRepository;  // ← ATRIBUTO

  constructor(repository: FakeRepository) {
    this.repository = repository;  // ← GUARDA
    console.log("  ⚙️  Service criado");
  }

  findAll(): FakeColaborador[] {
    console.log("  ⚙️  Service: vou chamar o Repository...");

    // ⭐ CHAMADA! ⭐
    const dados = this.repository.findAll();
    //            ^^^^^^^^^^^^^^^^^^^^^^^^^^

    console.log(`  ⚙️  Service: recebi ${dados.length} colaboradores`);
    return dados;
  }
}

class FakeController {
  private service: FakeService;  // ← ATRIBUTO

  constructor(service: FakeService) {
    this.service = service;  // ← GUARDA
    console.log("🎮 Controller criado");
  }

  handle(): void {
    console.log("🎮 Controller: recebi requisição HTTP");
    console.log("🎮 Controller: vou chamar o Service...");

    // ⭐ CHAMADA! ⭐
    const resultado = this.service.findAll();
    //                ^^^^^^^^^^^^^^^^^^^^^^

    console.log(`🎮 Controller: vou retornar ${resultado.length} colaboradores`);
    console.log("🎮 Response:", resultado.map(c => c.nome));
  }
}

// Montagem (igual ao server.ts)
console.log("\n--- MONTAGEM DOS OBJETOS ---\n");
const repo = new FakeRepository();
const service = new FakeService(repo);      // ← Service recebe Repository
const controller = new FakeController(service);  // ← Controller recebe Service

console.log("\n--- SIMULANDO REQUISIÇÃO HTTP ---\n");
controller.handle();

console.log("\n=== FIM ===\n");

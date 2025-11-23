// DEMONSTRAÇÃO: Por que NÃO chamar direto?

console.log("\n╔═══════════════════════════════════════════════════╗");
console.log("║  PROBLEMA 1: Trocar de MySQL para API Externa    ║");
console.log("╚═══════════════════════════════════════════════════╝\n");

// ❌ CÓDIGO RUIM - Chamando direto
class ControllerRuim1 {
  async listar() {
    console.log("❌ Controller: SELECT * FROM colaboradores");
    return ["João (do MySQL)", "Maria (do MySQL)"];
  }
}

class ControllerRuim2 {
  async buscar(id: number) {
    console.log(`❌ Controller: SELECT * FROM colaboradores WHERE id = ${id}`);
    return "João (do MySQL)";
  }
}

class ControllerRuim3 {
  async exportar() {
    console.log("❌ Controller: SELECT * FROM colaboradores");
    return "CSV: João, Maria (do MySQL)";
  }
}

console.log("--- Código RUIM rodando ---");
const ruim1 = new ControllerRuim1();
const ruim2 = new ControllerRuim2();
const ruim3 = new ControllerRuim3();

ruim1.listar();
ruim2.buscar(1);
ruim3.exportar();

console.log("\n😱 PROBLEMA: Precisa trocar para API Externa!");
console.log("😱 Solução: Mudar 3 controllers (e se fossem 50?)\n");

// ✅ CÓDIGO BOM - Com camadas
interface Repository {
  findAll(): Promise<string[]>;
  find(id: number): Promise<string>;
}

class MySQLRepository implements Repository {
  async findAll() {
    console.log("  💾 MySQL: SELECT * FROM colaboradores");
    return ["João (MySQL)", "Maria (MySQL)"];
  }
  async find(id: number) {
    console.log(`  💾 MySQL: SELECT * WHERE id = ${id}`);
    return "João (MySQL)";
  }
}

class APIRepository implements Repository {
  async findAll() {
    console.log("  🌐 API: GET https://api.com/colaboradores");
    return ["João (API)", "Maria (API)"];
  }
  async find(id: number) {
    console.log(`  🌐 API: GET https://api.com/colaboradores/${id}`);
    return "João (API)";
  }
}

class Service {
  constructor(private repository: Repository) {}

  async findAll() {
    return this.repository.findAll();
  }

  async find(id: number) {
    return this.repository.find(id);
  }
}

class ControllerBom1 {
  constructor(private service: Service) {}

  async listar() {
    console.log("✅ Controller: pedindo para Service");
    return this.service.findAll();
  }
}

class ControllerBom2 {
  constructor(private service: Service) {}

  async buscar(id: number) {
    console.log("✅ Controller: pedindo para Service");
    return this.service.find(id);
  }
}

class ControllerBom3 {
  constructor(private service: Service) {}

  async exportar() {
    console.log("✅ Controller: pedindo para Service");
    const data = await this.service.findAll();
    return `CSV: ${data.join(", ")}`;
  }
}

console.log("--- Código BOM com MySQL ---");
const mysqlRepo = new MySQLRepository();
const serviceMySQL = new Service(mysqlRepo);
const bom1 = new ControllerBom1(serviceMySQL);
const bom2 = new ControllerBom2(serviceMySQL);
const bom3 = new ControllerBom3(serviceMySQL);

bom1.listar();
bom2.buscar(1);
bom3.exportar();

console.log("\n🎉 TROCAR para API? FÁCIL! Muda SÓ 1 linha:");
console.log("--- Código BOM com API (MESMOS controllers!) ---");
const apiRepo = new APIRepository();  // ← SÓ MUDA ISSO!
const serviceAPI = new Service(apiRepo);
const bom1API = new ControllerBom1(serviceAPI);  // ← Mesmo controller!
const bom2API = new ControllerBom2(serviceAPI);  // ← Mesmo controller!
const bom3API = new ControllerBom3(serviceAPI);  // ← Mesmo controller!

bom1API.listar();
bom2API.buscar(1);
bom3API.exportar();

console.log("\n✅ Controllers NÃO mudaram!");
console.log("✅ Só criamos um novo Repository!");

console.log("\n\n╔═══════════════════════════════════════════════════╗");
console.log("║  PROBLEMA 2: Como TESTAR?                         ║");
console.log("╚═══════════════════════════════════════════════════╝\n");

console.log("❌ RUIM: Precisa de banco real para testar");
console.log("   - Teste LENTO");
console.log("   - Pode falhar por problema no banco");
console.log("   - Difícil isolar o código\n");

console.log("✅ BOM: Usa Mock!");

class MockRepository implements Repository {
  async findAll() {
    console.log("  🧪 Mock: retornando dados fake");
    return ["Teste1", "Teste2"];
  }
  async find(id: number) {
    console.log(`  🧪 Mock: retornando dado fake para id ${id}`);
    return "Teste";
  }
}

const mockRepo = new MockRepository();
const serviceTest = new Service(mockRepo);
const controller = new ControllerBom1(serviceTest);

console.log("--- Rodando TESTE (sem banco real!) ---");
controller.listar().then(resultado => {
  console.log(`✅ Teste passou! Resultado: ${resultado}`);
});
console.log("✅ Rápido! Confiável! Isolado!\n");

console.log("\n╔═══════════════════════════════════════════════════╗");
console.log("║  RESUMO                                           ║");
console.log("╚═══════════════════════════════════════════════════╝\n");

console.log("❌ SEM Camadas:");
console.log("   - Trocar fonte de dados = mudar N controllers");
console.log("   - Testar = precisa banco real");
console.log("   - Duplicação de código SQL\n");

console.log("✅ COM Camadas:");
console.log("   - Trocar fonte de dados = mudar 1 linha");
console.log("   - Testar = usa Mock, sem banco");
console.log("   - Zero duplicação, código em 1 lugar\n");

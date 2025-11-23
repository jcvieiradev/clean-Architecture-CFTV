// 🖨️ EXEMPLO: Impressoras Diferentes - Troca com 1 linha!

console.log("\n╔═══════════════════════════════════════════════════╗");
console.log("║  EXEMPLO: Impressoras MAIÚSCULA e minúscula      ║");
console.log("╚═══════════════════════════════════════════════════╝\n");

// ========================================
// 1. INTERFACE - Define o "contrato"
// ========================================

interface Impressora {
  imprimir(texto: string): void;
}

// ========================================
// 2. IMPLEMENTAÇÕES - Cada impressora diferente
// ========================================

class ImpressoraMaiuscula implements Impressora {
  imprimir(texto: string): void {
    console.log(`🖨️  [MAIÚSCULA]: ${texto.toUpperCase()}`);
  }
}

class ImpressoraMinuscula implements Impressora {
  imprimir(texto: string): void {
    console.log(`🖨️  [minúscula]: ${texto.toLowerCase()}`);
  }
}

class ImpressoraColorida implements Impressora {
  imprimir(texto: string): void {
    console.log(`🖨️  [COLORIDA]: 🌈 ${texto} 🌈`);
  }
}

class ImpressoraInvertida implements Impressora {
  imprimir(texto: string): void {
    const invertido = texto.split('').reverse().join('');
    console.log(`🖨️  [INVERTIDA]: ${invertido}`);
  }
}

// ========================================
// 3. ESCRITÓRIO - Usa QUALQUER impressora
// ========================================

class Escritorio {
  // ⭐ Guarda uma impressora (qualquer uma!)
  private impressora: Impressora;  // ← Interface, não classe concreta!

  constructor(impressora: Impressora) {
    this.impressora = impressora;
    console.log("📋 Escritório criado e recebeu uma impressora\n");
  }

  imprimirRelatorio(titulo: string, conteudo: string): void {
    console.log("📄 Escritório: vou imprimir um relatório...");

    // ⭐ Chama a impressora (não sabe qual é!)
    this.impressora.imprimir(`=== ${titulo} ===`);
    this.impressora.imprimir(conteudo);
    this.impressora.imprimir("=================");

    console.log("✅ Relatório impresso!\n");
  }

  imprimirCarta(destinatario: string, mensagem: string): void {
    console.log("✉️  Escritório: vou imprimir uma carta...");

    // ⭐ Chama a impressora (não sabe qual é!)
    this.impressora.imprimir(`Caro ${destinatario},`);
    this.impressora.imprimir(mensagem);
    this.impressora.imprimir("Atenciosamente,");
    this.impressora.imprimir("Equipe");

    console.log("✅ Carta impressa!\n");
  }
}

// ========================================
// 4. USO - Troca com 1 LINHA!
// ========================================

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔴 ESCRITÓRIO 1: Usando Impressora MAIÚSCULA");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const impressora1 = new ImpressoraMaiuscula();  // ← ESCOLHE a impressora
const escritorio1 = new Escritorio(impressora1);

escritorio1.imprimirRelatorio(
  "Relatorio Mensal",
  "Vendas aumentaram 20%"
);

escritorio1.imprimirCarta(
  "João Silva",
  "Parabéns pela promoção!"
);


console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🟢 ESCRITÓRIO 2: Usando Impressora minúscula");
console.log("   ⭐ MESMO código do Escritório, SÓ MUDA A IMPRESSORA!");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const impressora2 = new ImpressoraMinuscula();  // ← SÓ MUDA AQUI!
const escritorio2 = new Escritorio(impressora2);

escritorio2.imprimirRelatorio(
  "Relatorio Mensal",
  "Vendas aumentaram 20%"
);

escritorio2.imprimirCarta(
  "João Silva",
  "Parabéns pela promoção!"
);


console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔵 ESCRITÓRIO 3: Usando Impressora COLORIDA");
console.log("   ⭐ MESMO código do Escritório, SÓ MUDA A IMPRESSORA!");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const impressora3 = new ImpressoraColorida();  // ← SÓ MUDA AQUI!
const escritorio3 = new Escritorio(impressora3);

escritorio3.imprimirRelatorio(
  "Relatorio Mensal",
  "Vendas aumentaram 20%"
);


console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🟣 ESCRITÓRIO 4: Usando Impressora INVERTIDA");
console.log("   ⭐ MESMO código do Escritório, SÓ MUDA A IMPRESSORA!");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const impressora4 = new ImpressoraInvertida();  // ← SÓ MUDA AQUI!
const escritorio4 = new Escritorio(impressora4);

escritorio4.imprimirCarta(
  "Maria Santos",
  "Bem-vinda à equipe!"
);


console.log("\n╔═══════════════════════════════════════════════════╗");
console.log("║  RESUMO                                           ║");
console.log("╚═══════════════════════════════════════════════════╝\n");

console.log("✅ Classe Escritorio:");
console.log("   - NUNCA mudou!");
console.log("   - Funciona com QUALQUER impressora!");
console.log("   - Só precisa que a impressora tenha o método imprimir()\n");

console.log("✅ Para trocar de impressora:");
console.log("   - Muda SÓ 1 LINHA:");
console.log("   - const impressora = new ImpressoraMaiuscula();  ← ANTES");
console.log("   - const impressora = new ImpressoraMinuscula();  ← DEPOIS\n");

console.log("✅ Para criar nova impressora:");
console.log("   - Cria uma classe que implementa Impressora");
console.log("   - Escritório funciona automaticamente!\n");

console.log("🎯 ISSO É POLIMORFISMO + INVERSÃO DE DEPENDÊNCIA!");
console.log("   O Escritório depende da INTERFACE (Impressora)");
console.log("   NÃO da implementação (ImpressoraMaiuscula, etc)\n");


// ========================================
// 5. BÔNUS: Trocando em Runtime!
// ========================================

console.log("\n╔═══════════════════════════════════════════════════╗");
console.log("║  BÔNUS: Trocar impressora em RUNTIME             ║");
console.log("╚═══════════════════════════════════════════════════╝\n");

class EscritorioAvancado {
  private impressora: Impressora;

  constructor(impressora: Impressora) {
    this.impressora = impressora;
  }

  // ⭐ Método para TROCAR a impressora!
  trocarImpressora(novaImpressora: Impressora): void {
    console.log("🔄 Trocando impressora...");
    this.impressora = novaImpressora;
    console.log("✅ Impressora trocada!\n");
  }

  imprimir(texto: string): void {
    this.impressora.imprimir(texto);
  }
}

const escritorioFlex = new EscritorioAvancado(new ImpressoraMaiuscula());

console.log("Usando MAIÚSCULA:");
escritorioFlex.imprimir("hello world");

escritorioFlex.trocarImpressora(new ImpressoraMinuscula());

console.log("Usando minúscula:");
escritorioFlex.imprimir("hello world");

escritorioFlex.trocarImpressora(new ImpressoraColorida());

console.log("Usando COLORIDA:");
escritorioFlex.imprimir("hello world");

console.log("\n🎉 MESMO objeto, impressoras DIFERENTES!\n");

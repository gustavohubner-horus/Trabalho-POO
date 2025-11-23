//Atividade 2: Sistema de Funcionários
//Escopo de estudo: Herança e Polimorfismo;

//Classe abstrata funcionario, depois usada como herança em outras classes
abstract class Funcionario {
    // Atributos
    public nome: string;
    public salarioBase: number;
    public identificacao: string;

    // Inicializador do objeto 
    constructor(nome: string, salarioBase: number, identificacao: string) {
        this.nome = nome;
        this.salarioBase = salarioBase;
        this.identificacao = identificacao;
    }
    
    //Método abstrato para calcular salario. Para cada classe que herdar, vai calcular diferente (polimorfismo)
    abstract calcularSalario(): number;

    // Método  para obter detalhes
    public getDetalhes(): string {
        return `ID: ${this.identificacao}, Nome: ${this.nome}, Base: R$ ${this.salarioBase.toFixed(2)}`;
    }
}

//Classe gerente que herda da classe funcionario 
class Gerente extends Funcionario {
    //Atributos
    private bonusPercentual: number = 0.20; // 20% de bonus 

    //Inicializador do objeto
    constructor(nome: string, salarioBase: number, identificacao: string) {
        super(nome, salarioBase, identificacao);
    }

    //Método para calcular o salario do gerente, com o bonus de 20%
    calcularSalario(): number {
        const bonus = this.salarioBase * this.bonusPercentual;
        return this.salarioBase + bonus;
    }
}

//Classe Desenvolvedor que herda da classe funcionario 
class Desenvolvedor extends Funcionario {
    //Atributos do desenvolvedor
      public projetosEntregues: number;
      private bonusPorProjeto: number = 0.10; // 10% de bonus

    //Inicializador do objeto
    constructor(nome: string, salarioBase: number, identificacao: string, projetosEntregues: number) {
        super(nome, salarioBase, identificacao);
        this.projetosEntregues = projetosEntregues;
    }

    //Método para calcular o salario do Desenvolvedor, com o bonus de 10%
    calcularSalario(): number {
        const bonusTotal = this.salarioBase * this.bonusPorProjeto * this.projetosEntregues;
        return this.salarioBase + bonusTotal;
    }
}
//Classe Desenvolvedor que herda da classe funcionario 
class Estagiario extends Funcionario {
    //Atributos
    constructor(nome: string, salarioBase: number, identificacao: string) {
        super(nome, salarioBase, identificacao);
    }
    //Método para calcular o salario do estagiario, ele não tem bonus
    calcularSalario(): number {
        return this.salarioBase;
    }
}

//Criação de 4 Objetos gerente
const gerentes: Gerente[] = [
    new Gerente("Gustavo", 8000.00, "G1"),
    new Gerente("Tainara", 8500.00, "G2"),
    new Gerente("Ricardo", 9200.00, "G3"),
    new Gerente("Juliano", 7800.00, "G4"),
];

//Criação de 4 objetos desenvolvedor
const desenvolvedores: Desenvolvedor[] = [
    new Desenvolvedor("Eduardo", 5000.00, "D1", 3), // 3 projetos
    new Desenvolvedor("Joao", 5500.00, "D2", 5), // 5 projetos
    new Desenvolvedor("Gabriel", 4800.00, "D3", 2), // 2 projetos
    new Desenvolvedor("Bruno", 6000.00, "D4", 4), // 4 projetos
];

//Criação de 4 objetos estagiario
const estagiarios: Estagiario[] = [
    new Estagiario("Igor", 1500.00, "E1"),
    new Estagiario("Artur", 1650.00, "E2"),
    new Estagiario("Vinicius", 1500.00, "E3"),
    new Estagiario("Isai", 1700.00, "E4"),
];

//Cria lista de objeto funcionarios
const listaFuncionarios: Funcionario[] = [
    ...gerentes,
    ...desenvolvedores,
    ...estagiarios
];

//A chamada calcularSalario() executa um método diferente pra cada tipo de funcionario
listaFuncionarios.forEach((funcionario: Funcionario) => {
    const salarioCalculado = funcionario.calcularSalario(); // CHAMADA POLIMÓRFICA

    let tipo: string;
    if (funcionario instanceof Gerente) {
        tipo = "Gerente";} 
    else if (funcionario instanceof Desenvolvedor) {
        tipo = `Desenvolvedor (${(funcionario as Desenvolvedor).projetosEntregues} projetos entregues)`;} 
    else {tipo = "Estagiario";}

    console.log(`[${tipo.padEnd(25)}] ${funcionario.getDetalhes()} -> salario final: R$ ${salarioCalculado.toFixed(2)}`);
});
// Atividade 4: Código Refatorado - Sistema de Biblioteca com OOP
// Versão Corrigida (Inclusão do Bloco de Execução)

// Problemas encontrados na versão original:
// -----------------------------------------------------------------------------------------
// 1-Encapsulamento (Violação de Privacidade)
// Problema: Uma única classe (BibliotecaManager) continha toda a lógica do sistema, com métodos gigantes (realizarEmprestimo, realizarDevolucao) que misturavam validação,
// cálculo e atualização de dados.
// Ação: Separar as responsabilidades: criar classes de Entidade (Livro, Usuario, Emprestimo) para gerenciar seu próprio estado, 
// e uma classe de Serviço/Controle (SistemaBiblioteca) para orquestrar as operações.
// -----------------------------------------------------------------------------------------
// 2-Abstração e Responsabilidade Única (SRP)
// Problema: Uma única classe (BibliotecaManager) continha toda a lógica do sistema, com métodos gigantes (realizarEmprestimo, 
// realizarDevolucao) que misturavam validação, cálculo e atualização de dados.
// Ação: Separar as responsabilidades: criar classes de Entidade (Livro, Usuario, Emprestimo) para gerenciar seu próprio 
// estado, e uma classe de Serviço/Controle (SistemaBiblioteca) para orquestrar as operações.
// -----------------------------------------------------------------------------------------
// 3-Herança e Polimorfismo
// Problema: As regras específicas para tipos de usuário ("estudante", "professor", "comum") eram tratadas por longas 
// cadeias de if/else dentro dos métodos de empréstimo.
// Ação: Implementar Herança (Classe base Usuario) e Polimorfismo (Subclasses como Estudante e Professor sobrescrevendo 
// métodos como getDiasEmprestimo()), eliminando o if/else da lógica principal.
// -----------------------------------------------------------------------------------------
// 4-Acoplamento de Lógica
// Problema: A lógica de busca de usuários e livros (for loops) era repetida em vários métodos diferentes.
// Ação: Criar métodos auxiliares privados e centralizados (private buscarUsuario(id), private buscarLivro(id)) para gerenciar 
// a consulta aos dados, reduzindo a repetição e o acoplamento.
// -----------------------------------------------------------------------------------------
// 5-Coesão e Tipagem de Dados
// Problema: Os dados eram armazenados como objetos genéricos (any[]) em vez de instâncias de classes, 
// resultando em falta de tipagem e dificuldade em rastrear o estado.
// Ação: Utilizar a Tipagem Forte do TypeScript e garantir que as coleções armazenem apenas instâncias das classes 
// de Entidade (Livro[], Usuario[], Emprestimo[]).
// -----------------------------------------------------------------------------------------

// 1. CLASSES DE ENTIDADE E ENCAPSULAMENTO
class Livro {
    private id: number;
    private titulo: string;
    private autor: string;
    private ano: number;
    private _quantidadeTotal: number;
    private _disponiveis: number; // Encapsulado
    private categoria: string;
    private preco: number;

    constructor(id: number, titulo: string, autor: string, ano: number, quantidade: number, categoria: string, preco: number) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.ano = ano;
        this._quantidadeTotal = quantidade;
        this._disponiveis = quantidade; 
        this.categoria = categoria;
        this.preco = preco;
    }

    // Getters para acesso controlado (Encapsulamento)
    public getId(): number { return this.id; }
    public getTitulo(): string { return this.titulo; }
    public getAutor(): string { return this.autor; }
    public getDisponiveis(): number { return this._disponiveis; }
    public getQuantidadeTotal(): number { return this._quantidadeTotal; }
    public getCategoria(): string { return this.categoria; }
    public getPreco(): number { return this.preco; }
    public getAno(): number { return this.ano; }

    // Métodos para controle do estado (Encapsulamento)
    public emprestar(): boolean {
        if (this._disponiveis > 0) {
            this._disponiveis--;
            return true;
        }
        return false;
    }

    public devolver(): void {
        this._disponiveis++;
    }
}

// 2. CLASSES DE USUÁRIO (Herança e Polimorfismo)
// CLASSE BASE ABSTRATA: Usuario
abstract class Usuario {
    protected id: number;
    protected nome: string;
    protected cpf: string;
    protected _ativo: boolean;
    protected _multas: number; // Encapsulado
    protected telefone: string;

    constructor(id: number, nome: string, cpf: string, telefone: string) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this._ativo = true;
        this._multas = 0;
        this.telefone = telefone;
    }

    // Getters
    public getId(): number { return this.id; }
    public getNome(): string { return this.nome; }
    public getAtivo(): boolean { return this._ativo; }
    public getMultas(): number { return this._multas; }
    public getTelefone(): string { return this.telefone; }
    
    // Métodos Abstratos (Polimorfismo)
    public abstract getTipo(): string; 
    public abstract getLimiteEmprestimos(): number; 
    public abstract getDiasEmprestimo(): number; 

    // Controle de Multa (Encapsulamento)
    public aplicarMulta(valor: number): void {
        this._multas += valor;
    }
    
    // Regra de negócio importante (Abstração)
    public podeEmprestar(): boolean {
        return this._ativo && this._multas === 0;
    }
}

// CLASSES FILHAS (Herança e Polimorfismo)
class Estudante extends Usuario {
    public getTipo(): string { return "Estudante"; }
    public getLimiteEmprestimos(): number { return 3; }
    public getDiasEmprestimo(): number { return 14; }
}

class Professor extends Usuario {
    public getTipo(): string { return "Professor"; }
    public getLimiteEmprestimos(): number { return 5; }
    public getDiasEmprestimo(): number { return 30; }
}

class Comum extends Usuario {
    public getTipo(): string { return "Comum"; }
    public getLimiteEmprestimos(): number { return 2; }
    public getDiasEmprestimo(): number { return 7; }
}

// 3. CLASSE EMPRESTIMO (Entidade de Relacionamento e SRP)
class Emprestimo {
    private id: number;
    private usuario: Usuario;
    private livro: Livro;
    private dataEmprestimo: Date;
    private dataDevolucaoPrevista: Date;
    private _devolvido: boolean;
    private taxaMultaDiaria: number = 0.50; // Taxa padrão

    constructor(id: number, usuario: Usuario, livro: Livro) {
        this.id = id;
        this.usuario = usuario;
        this.livro = livro;
        this.dataEmprestimo = new Date();
        this._devolvido = false;

        const diasEmprestimo = usuario.getDiasEmprestimo(); // Polimorfismo
        this.dataDevolucaoPrevista = new Date();
        this.dataDevolucaoPrevista.setDate(this.dataDevolucaoPrevista.getDate() + diasEmprestimo);
    }

    // Getters
    public getId(): number { return this.id; }
    public getUsuario(): Usuario { return this.usuario; }
    public getLivro(): Livro { return this.livro; }
    public getDataDevolucaoPrevista(): Date { return this.dataDevolucaoPrevista; }
    public estaDevolvido(): boolean { return this._devolvido; }

    // Lógica principal de Devolução (Responsabilidade Única)
    public processarDevolucao(): number {
        if (this._devolvido) {
            console.log("ERRO: Este empréstimo já foi devolvido.");
            return 0;
        }

        const dataAtual = new Date();
        this._devolvido = true;
        this.livro.devolver(); // Atualiza a disponibilidade via Livro

        let multa = 0;
        if (dataAtual > this.dataDevolucaoPrevista) {
            const diffTime = dataAtual.getTime() - this.dataDevolucaoPrevista.getTime();
            // Math.ceil garante que 1 dia e 1 minuto de atraso já contam como 2 dias.
            const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            multa = diasAtraso * this.taxaMultaDiaria;

            this.usuario.aplicarMulta(multa); // Aplica multa via método encapsulado
            console.log(`ATENÇÃO: Devolução com ${diasAtraso} dia(s) de atraso. Multa aplicada: R$${multa.toFixed(2)}.`);
        } else {
            console.log("Devolução dentro do prazo. Sem multas!");
        }

        return multa;
    }
}

// 4. CLASSE DE GERENCIAMENTO (Abstração e Controle)
class SistemaBiblioteca {
    // Encapsulamento: coleções são privadas
    private livros: Livro[] = [];
    private usuarios: Usuario[] = [];
    private emprestimos: Emprestimo[] = [];
    private reservas: any[] = []; 

    constructor() {
        // Inicialização de dados usando as classes de Entidade
        this.livros.push(new Livro(1, "Clean Code", "Robert Martin", 2008, 3, "tecnologia", 89.90));
        this.livros.push(new Livro(2, "1984", "George Orwell", 1949, 2, "ficcao", 45.00));
        this.livros.push(new Livro(3, "Sapiens", "Yuval Harari", 2011, 4, "historia", 65.50));
        this.livros.push(new Livro(4, "O Hobbit", "Tolkien", 1937, 2, "fantasia", 55.00));
        
        const usuarioAna = new Estudante(1, "Ana Silva", "12345678901", "48999999999");
        this.usuarios.push(usuarioAna);
        
        const usuarioCarlos = new Professor(2, "Carlos Santos", "98765432100", "48988888888");
        usuarioCarlos.aplicarMulta(15.50); // Simula multa inicial 
        this.usuarios.push(usuarioCarlos);
        
        this.usuarios.push(new Comum(3, "Beatriz Costa", "11122233344", "48977777777"));
    }
    
    // Métodos Auxiliares para busca (Acoplamento Reduzido)
    private buscarUsuario(id: number): Usuario | undefined {
        return this.usuarios.find(u => u.getId() === id);
    }

    private buscarLivro(id: number): Livro | undefined {
        return this.livros.find(l => l.getId() === id);
    }
    
    private contarEmprestimosAtivos(usuarioId: number): number {
        return this.emprestimos.filter(e => e.getUsuario().getId() === usuarioId && !e.estaDevolvido()).length;
    }

    // MÉTODO DE EMPRÉSTIMO
    public realizarEmprestimo(usuarioId: number, livroId: number): void {
        console.log(`\n=== PROCESSANDO EMPRÉSTIMO para Usuário ID ${usuarioId} | Livro ID ${livroId} ===`);
        
        const usuario = this.buscarUsuario(usuarioId);
        const livro = this.buscarLivro(livroId);

        if (!usuario || !livro) {
            console.log(`ERRO: ${!usuario ? "Usuário" : "Livro"} não encontrado!`); return;
        }

        // Validações delegadas ao objeto Usuário (Abstração)
        if (!usuario.podeEmprestar()) {
            if (!usuario.getAtivo()) console.log("ERRO: Usuário inativo!");
            if (usuario.getMultas() > 0) console.log(`ERRO: Usuário possui multas pendentes de R$${usuario.getMultas().toFixed(2)}!`);
            return;
        }
        
        // Validação de limite de empréstimos
        const ativos = this.contarEmprestimosAtivos(usuarioId);
        const limite = usuario.getLimiteEmprestimos(); // Polimorfismo
        
        if (ativos >= limite) {
            console.log(`ERRO: Usuário já atingiu o limite de ${limite} empréstimos!`);
            return;
        }
        
        // Validação e Processamento de Empréstimo (Encapsulamento)
        if (!livro.emprestar()) {
            console.log("ERRO: Livro indisponível no momento!"); return;
        }

        const novoEmprestimoId = this.emprestimos.length + 1;
        const novoEmprestimo = new Emprestimo(novoEmprestimoId, usuario, livro); 
        this.emprestimos.push(novoEmprestimo);
        
        console.log(`SUCESSO: Livro '${livro.getTitulo()}' emprestado para ${usuario.getNome()}.`);
        console.log(`Tipo: ${usuario.getTipo()} | Dias Permitidos: ${usuario.getDiasEmprestimo()}`);
        console.log(`Data de Devolução Prevista: ${novoEmprestimo.getDataDevolucaoPrevista().toLocaleDateString()}`);
    }

    // MÉTODO DE DEVOLUÇÃO
    public realizarDevolucao(emprestimoId: number): void {
        console.log(`\n=== PROCESSANDO DEVOLUÇÃO do Empréstimo ID ${emprestimoId} ===`);

        const emprestimo = this.emprestimos.find(e => e.getId() === emprestimoId);

        if (!emprestimo) {
            console.log("ERRO: Empréstimo não encontrado!"); return;
        }
        
        const usuario = emprestimo.getUsuario();
        const livro = emprestimo.getLivro();

        const multaGerada = emprestimo.processarDevolucao(); 
        
        // Comprovante de Devolução
        console.log("\n╔════════════════════════════════════╗");
        console.log("║      COMPROVANTE DE DEVOLUÇÃO      ║");
        console.log("╠════════════════════════════════════╣");
        console.log(`║ Usuário: ${usuario.getNome()}`);
        console.log(`║ Livro: ${livro.getTitulo()}`);
        console.log(`║ Multa: R$${multaGerada.toFixed(2)}`);
        console.log(`║ Total de multas pendentes: R$${usuario.getMultas().toFixed(2)}`);
        console.log("╚════════════════════════════════════╝\n");
    }
    
    // Método Adicionar Livro (Encapsulamento)
    public adicionarLivro(titulo: string, autor: string, ano: number, quantidade: number, categoria: string, preco: number) {
        const novoId = this.livros.length + 1;
        this.livros.push(new Livro(novoId, titulo, autor, ano, quantidade, categoria, preco));
        console.log(`Livro '${titulo}' adicionado com sucesso! (ID: ${novoId})`);
    }

    // Método Cadastrar Usuário (Polimorfismo na criação)
    public cadastrarUsuario(nome: string, cpf: string, tipo: string, telefone: string) {
        const novoId = this.usuarios.length + 1;
        let novoUsuario: Usuario;

        // Uso do tipo para criar a classe correta
        if (tipo.toLowerCase() === "estudante") {
            novoUsuario = new Estudante(novoId, nome, cpf, telefone);
        } else if (tipo.toLowerCase() === "professor") {
            novoUsuario = new Professor(novoId, nome, cpf, telefone);
        } else {
            novoUsuario = new Comum(novoId, nome, cpf, telefone);
        }

        this.usuarios.push(novoUsuario);
        console.log(`Usuário '${nome}' (${novoUsuario.getTipo()}) cadastrado com sucesso!`);
    }

    public gerarRelatorioCompleto(): void {
        console.log("\n--- RELATÓRIO GERAL DA BIBLIOTECA ---");
        
        // Estatísticas de Livros
        const totalLivros = this.livros.reduce((acc, l) => acc + l.getQuantidadeTotal(), 0);
        const livrosDisponiveis = this.livros.reduce((acc, l) => acc + l.getDisponiveis(), 0);
        
        console.log(`\nACERVO: Total: ${totalLivros} | Disponíveis: ${livrosDisponiveis} | Emprestados: ${totalLivros - livrosDisponiveis}`);

        // Estatísticas de Usuários
        const totalMultas = this.usuarios.reduce((acc, u) => acc + u.getMultas(), 0);
        const usuariosAtivos = this.usuarios.filter(u => u.getAtivo()).length;

        console.log(`USUÁRIOS: Total: ${this.usuarios.length} | Ativos: ${usuariosAtivos} | Total em Multas: R$${totalMultas.toFixed(2)}`);
        
        // Estatísticas de Empréstimos
        const emprestimosAtivos = this.emprestimos.filter(e => !e.estaDevolvido()).length;
        console.log(`EMPRÉSTIMOS: Total Histórico: ${this.emprestimos.length} | Ativos: ${emprestimosAtivos}`);
    }

    public buscarLivros(termo: string) {
        console.log("\n=== RESULTADOS DA BUSCA: '" + termo + "' ===");
        var encontrados = 0;
        
        // CORREÇÃO APLICADA: Usando 'for...of' para garantir a tipagem Livro
        for (const livro of this.livros) { 
            if (livro.getTitulo().toLowerCase().includes(termo.toLowerCase()) || 
                livro.getAutor().toLowerCase().includes(termo.toLowerCase())) {
            
                encontrados++;
                console.log("\n📚 " + livro.getTitulo());
                console.log("    Autor: " + livro.getAutor());
                console.log("    Ano: " + livro.getAno());
                console.log("    Categoria: " + livro.getCategoria());
                console.log("    Disponíveis: " + livro.getDisponiveis() + "/" + livro.getQuantidadeTotal());
                console.log("    Preço: R$" + livro.getPreco().toFixed(2));
                
                if (livro.getDisponiveis() > 0) {
                    console.log("    ✅ DISPONÍVEL PARA EMPRÉSTIMO");
                } else {
                    console.log("    ❌ INDISPONÍVEL NO MOMENTO");
                }
            }
        }
    
        if (encontrados == 0) {
            console.log("Nenhum livro encontrado.");
        } else {
            console.log("\n" + encontrados + " livro(s) encontrado(s).");
        }
    }
}

// =======================================================================
// SIMULAÇÃO FINAL: ESTE BLOCO FAZ O CÓDIGO EXECUTAR E IMPRIMIR NO CONSOLE
// =======================================================================
console.log("Arquivo carregado e rodando!");
console.log("\n╔═══════════════════════════════════════════╗");
console.log("║   SISTEMA DE GERENCIAMENTO DE BIBLIOTECA  ║");
console.log("╚═══════════════════════════════════════════╝");

const biblioteca = new SistemaBiblioteca();

console.log("\n--- TESTE 1: Empréstimo Estudante (Sucesso) ---");
biblioteca.realizarEmprestimo(1, 1); // Ana (Estudante, 14 dias) pega 'Clean Code'

console.log("\n--- TESTE 2: Tentativa de Empréstimo com Multa (Falha esperada) ---");
biblioteca.realizarEmprestimo(2, 2); // Carlos (Professor) tem multa inicial (R$15.50), deve falhar.

console.log("\n--- TESTE 3: Buscar livros ---");
biblioteca.buscarLivros("code");

console.log("\n--- TESTE 4: Devolução no Prazo (Sem Multa) ---");
biblioteca.realizarDevolucao(1); // Ana devolve

// Simulação de Atraso para o próximo empréstimo
biblioteca.realizarEmprestimo(1, 4); // Ana pega 'O Hobbit'
const emp3 = biblioteca["emprestimos"].find(e => e.getLivro().getId() === 4 && e.estaDevolvido() === false);
if (emp3) {
    const dataAtrasada = new Date();
    dataAtrasada.setDate(dataAtrasada.getDate() - 5); 
    // Quebra de encapsulamento usada SOMENTE para simular o atraso no teste
    (emp3 as any)["dataDevolucaoPrevista"] = dataAtrasada; 
}

console.log("\n--- TESTE 5: Devolução Atrasada (Gera Multa) ---");
biblioteca.realizarDevolucao(3); // Ana devolve O Hobbit, gera multa de 5 dias * R$0.50 = R$2.50.

console.log("\n--- TESTE 6: Tentativa de Empréstimo com Multa Recente (Falha esperada) ---");
biblioteca.realizarEmprestimo(1, 2); // Ana agora tem multa (R$2.50), deve falhar.

console.log("\n--- TESTE 7: Adicionar novos livro e usuário ---");
biblioteca.adicionarLivro("Design Patterns", "Gang of Four", 1994, 2, "tecnologia", 120.00);
biblioteca.cadastrarUsuario("Diego Souza", "55566677788", "estudante", "48966666666");

biblioteca.gerarRelatorioCompleto();
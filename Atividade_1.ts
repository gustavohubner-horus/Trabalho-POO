class Livro{
  public titulo: string;
  public autor: string;
  public editora:string;
  public anoPublicacao: number;
  public disponivel: boolean;

  constructor(titulo: string, autor: string, editora: string, anoPublicacao: number) {
  this.titulo = titulo;
  this.autor = autor;
  this.editora = editora;
  this.anoPublicacao = anoPublicacao;
  this.disponivel = true; 
} 
    emprestar(): boolean {
        if (this.disponivel) {
            this.disponivel = false;
            return true;
        }
        return false;
    }

    devolver(): void {
        this.disponivel = true;
    }
}

class Membro {
    nome: string;
    identificacao: string;
    livrosEmprestados: Livro[];

    constructor(nome: string, identificacao: string) {
        this.nome = nome;
        this.identificacao = identificacao;
        this.livrosEmprestados = [];
    }

    pegarEmprestado(livro: Livro): void {
        if (livro.emprestar()) {
            this.livrosEmprestados.push(livro);
        }
    }

    devolverLivro(livro: Livro): void {
        const index = this.livrosEmprestados.indexOf(livro);
        if (index !== -1) {
            this.livrosEmprestados.splice(index, 1);
            livro.devolver();
        }
    }
}

const livro1 = new Livro("Clean Code", "Robert C. Martin", "Prentice Hall", 2008);
const livro2 = new Livro("Design Patterns", "Gang of Four", "Addison-Wesley", 1994);
const livro3 = new Livro("The Pragmatic Programmer", "Andy Hunt", "Addison-Wesley", 1999);
const livro4 = new Livro("Refactoring", "Martin Fowler", "Addison-Wesley", 1999);

const membro1 = new Membro("Gustavo ", "M01");
const membro2 = new Membro("Tainara", "M02");
const membro3 = new Membro("Ricardo ", "M03");

membro1.pegarEmprestado(livro1);

membro2.pegarEmprestado(livro2);

membro3.pegarEmprestado(livro3);

membro1.pegarEmprestado(livro1);

membro1.pegarEmprestado(livro4);

membro1.devolverLivro(livro1);

membro2.pegarEmprestado(livro1);

membro3.devolverLivro(livro3);

membro3.pegarEmprestado(livro3);

membro2.devolverLivro(livro2);

membro1.devolverLivro(livro4);

membro3.pegarEmprestado(livro4);

console.log(`Gustavo tem ${membro1.livrosEmprestados.length} livro(s)`);
console.log(`Tainara tem ${membro2.livrosEmprestados.length} livro(s)`);
console.log(`Ricardo tem ${membro3.livrosEmprestados.length} livro(s)`);
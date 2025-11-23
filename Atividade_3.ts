//Atividade 3: Sistema de Pagamento
//Escopo de estudo: Abstração, Encapsulamento e
//Relacionamento;

//Interface MeioPagamento (ABSTRAÇÃO)
interface MeioPagamento {
    processarPagamento(valor: number, conta: ContaBancaria): boolean;
}
//Classe ContaBancaria (ENCAPSULAMENTO)
class ContaBancaria {
    private numeroConta: string;
    private titular: string;
    private _saldo: number;
    private _historico: { tipo: string, valor: number, data: Date, sucesso: boolean }[];

    constructor(numeroConta: string, titular: string, saldoInicial: number) {
        this.numeroConta = numeroConta;
        this.titular = titular;
        this._saldo = saldoInicial;
        this._historico = [];
    }

    public get saldo(): number {
        return this._saldo;
    }

    public get nomeTitular(): string {
        return this.titular;
    }

    public realizarMovimentacao(valor: number, tipo: string, sucesso: boolean): void {
        this._saldo += valor;
        this._historico.push({ tipo, valor, data: new Date(), sucesso });
    }

    public exibirExtrato(): void {
        console.log(`\nExtrato da Conta ${this.numeroConta} (${this.titular})`);
        console.log(`Saldo Atual: R$ ${this._saldo.toFixed(2)}`);
        console.log("--- Histórico ---\n");
        this._historico.forEach(mov => {
            const status = mov.sucesso ? "SUCESSO" : "FALHA";
            const sinal = mov.valor >= 0 ? "+" : "";
            // Usando nome completo na coluna tipo
            console.log(`[${status.padEnd(7)}] ${mov.data.toLocaleDateString()} - ${mov.tipo.padEnd(20)}: ${sinal}R$ ${mov.valor.toFixed(2)}`);
        });
    }
}

//Classe CartaoCredito que implementa MeioPagamento
class CartaoCredito implements MeioPagamento {
    private numero: string;
    private validade: string;
    private cvv: string;
    private limite: number; 

    constructor(numero: string, validade: string, cvv: string, limite: number) {
        this.numero = numero;
        this.validade = validade;
        this.cvv = cvv;
        this.limite = limite;
    }

    public processarPagamento(valor: number, conta: ContaBancaria): boolean {
        // Valida limite de crédito
        if (valor > this.limite) {
            console.log(`R$${valor.toFixed(2)} excede o limite R$${this.limite.toFixed(2)}.\n`);
            conta.realizarMovimentacao(0, "Cartão de Crédito", false);
            return false;
        }
        const partesValidade = this.validade.split('/');
        const mes = Number(partesValidade[0]);
        const ano = Number(partesValidade[1]);

        if (isNaN(mes) || isNaN(ano) || partesValidade.length !== 2) {
            console.log("Formato de validade inválido.\n");
            conta.realizarMovimentacao(0, "Cartão de Crédito", false);
            return false;
        }

        const anoAtual = new Date().getFullYear() % 100;

        if (ano < anoAtual) {
            console.log("Cartão expirado.\n");
            conta.realizarMovimentacao(0, "Cartão de Crédito", false);
            return false;
}

console.log(`R$${valor.toFixed(2)} (Limite restante: R$${(this.limite - valor).toFixed(2)})\n`);
conta.realizarMovimentacao(-valor, "Cartão de Crédito", true); 
return true;
    }
}

// Classe CartaoDebito que implementa MeioPagamento
class CartaoDebito implements MeioPagamento {
    private numero: string;
    private validade: string;
    private senhaHash: string; 

    //Instancia o objeto
    constructor(numero: string, validade: string, senha: string) {
        this.numero = numero;
        this.validade = validade;
        this.senhaHash = senha;
    }

    public processarPagamento(valor: number, conta: ContaBancaria): boolean {
        // Validação: Saldo Suficiente
        if (valor > conta.saldo) {
            console.log(`Saldo insuficiente (R$${conta.saldo.toFixed(2)}) para R$${valor.toFixed(2)}.\n`);
            conta.realizarMovimentacao(0, "Cartão de Débito", false);
            return false;
        }

        console.log(`R$${valor.toFixed(2)} debitado de ${conta.nomeTitular}.\n`);
        conta.realizarMovimentacao(-valor, "Cartão de Débito", true);
        return true;
    }
}

//Classe BoletoBancario que implementa MeioPagamento
class BoletoBancario implements MeioPagamento {
    private linhaDigitavel: string;
    private vencimento: Date; 

    //Inicializa o objeto
    constructor(linhaDigitavel: string, diasParaVencimento: number) {
        this.linhaDigitavel = linhaDigitavel;
        this.vencimento = new Date();
        this.vencimento.setDate(this.vencimento.getDate() + diasParaVencimento);
    }

    public processarPagamento(valor: number, conta: ContaBancaria): boolean {
        // Valida saldo suficiente
        if (valor > conta.saldo) {
            console.log(`Saldo insuficiente para pagar R$${valor.toFixed(2)}.`);
            conta.realizarMovimentacao(0, "Boleto Bancário", false);
            return false;
        }

        // Validação: Vencimento
        if (new Date() > this.vencimento) {
            console.log(`Boleto vencido em ${this.vencimento.toLocaleDateString()}.`);
            conta.realizarMovimentacao(0, "Boleto Bancário", false);
            return false;
        }

        console.log(`R$${valor.toFixed(2)} pago da conta de ${conta.nomeTitular}.`);
        conta.realizarMovimentacao(-valor, "Boleto Bancário", true);
        return true;
    }
}

// Classe Pix que implementa MeioPagamento
class Pix implements MeioPagamento {
    private chaveDestino: string; 

    //Inicializa o objeto
    constructor(chaveDestino: string) {
        this.chaveDestino = chaveDestino;
    }
    public processarPagamento(valor: number, conta: ContaBancaria): boolean {
        // Valida saldo suficiente
        if (valor > conta.saldo) {
            console.log(`Saldo insuficiente (R$${conta.saldo.toFixed(2)}) para R$${valor.toFixed(2)}.\n`);
            conta.realizarMovimentacao(0, "Pix", false);
            return false;
        }
        console.log(`R$${valor.toFixed(2)} transferido para ${this.chaveDestino} da conta de ${conta.nomeTitular}.\n`);
        conta.realizarMovimentacao(-valor, "Pix", true);
        return true;
    }
}

//Criação de 4 Contas Bancárias
const contaJoao = new ContaBancaria("001-5", "João", 5000.00);
const contaMaria = new ContaBancaria("002-3", "Maria", 250.00); 
const contaPedro = new ContaBancaria("003-1", "Pedro", 12000.00);
const contaAna = new ContaBancaria("004-8", "Ana", 800.00);

//Criação de novos meios de pagamento
const CreditoJoao = new CartaoCredito("1111-...", "05/27", "123", 1000.00); 
const DebitoMaria = new CartaoDebito("2222-...", "10/29", "1234");
const boletoVencido = new BoletoBancario("9999...", -5);
const boletoAtual = new BoletoBancario("8888...", 7);
const pixChave = new Pix("chave@pix.com.br");


CreditoJoao.processarPagamento(500.00, contaPedro); 
CreditoJoao.processarPagamento(1500.00, contaAna); 
DebitoMaria.processarPagamento(300.00, contaMaria); 
boletoVencido.processarPagamento(50.00, contaJoao); 
boletoAtual.processarPagamento(350.00, contaJoao); 
pixChave.processarPagamento(150.00, contaMaria); 
pixChave.processarPagamento(10000.00, contaPedro); 


//historico final das 4 contas
contaJoao.exibirExtrato();
contaMaria.exibirExtrato();
contaPedro.exibirExtrato();
contaAna.exibirExtrato();
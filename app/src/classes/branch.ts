import { Commit } from "./commit";
import { NoArquivo } from "./NoArquivo";
import { NoDiretorio } from "./NoDiretorio";

export class Branch {
  nome: string;
  raiz: NoDiretorio;
  principal: boolean;
  commits: Commit[];
  constructor(nome: string, raiz: NoDiretorio) {
    this.nome = nome;
    this.raiz = raiz;
    this.principal = false;
    this.commits = [];
  }

  adicionarPasta(nome: string): void {
    const novoDiretorio = new NoDiretorio(nome, this.raiz);
    this.raiz.criarFilho(novoDiretorio);
  }

  adicionarArquivo(nome: string): void {
    const novoArquivo = new NoArquivo(nome, this.raiz);
    this.raiz.criarFilho(novoArquivo);
  }

  getRaiz(): NoDiretorio {
    return this.raiz;
  }
}

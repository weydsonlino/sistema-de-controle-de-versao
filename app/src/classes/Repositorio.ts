import { NoArquivo } from "./NoArquivo";
import { NoDiretorio } from "./NoDiretorio";
import { Versao } from "./Versao";

export class Repositorio {
  nome: string;
  raiz: NoDiretorio;
  constructor(nome: string, raiz: NoDiretorio) {
    this.nome = nome;
    this.raiz = raiz;
  }

  adicionarPasta(nome: string): void {
    const novoDiretorio = new NoDiretorio(nome);
    this.raiz.criarFilho(novoDiretorio);
  }

  adicionarArquivo(nome: string, id: string, versao: Versao): void {
    const novoArquivo = new NoArquivo(nome, versao);
    this.raiz.criarFilho(novoArquivo);
  }

  getRaiz(): NoDiretorio {
    return this.raiz;
  }
}

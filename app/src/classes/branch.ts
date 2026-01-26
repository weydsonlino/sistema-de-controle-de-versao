import { Commit } from "./commit";
import { NoArquivo } from "./NoArquivo";
import { NoDiretorio } from "./NoDiretorio";
import { Versao } from "./Versao";

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

  criarCommit(arquivoModificado: NoArquivo, versao: Versao): Commit {
    const novoCommit = new Commit(arquivoModificado, versao);
    this.commits.push(novoCommit);
    return novoCommit;
  }

  buscarCommitEmAndamento(): Commit | undefined {
    return this.commits.find((commit) => commit.committed === false);
  }
}

import { NoArquivo } from "./NoArquivo";
import { NoDiretorio } from "./NoDiretorio";
import { Versao } from "./Versao";

export class Repositorio {
  static value: number = 0;
  id: number;
  nome: string;
  raiz: NoDiretorio;
  branchs: string[];
  commits: string[];
  tags: string[];
  constructor(nome: string) {
    this.nome = nome;
    this.raiz = new NoDiretorio("/", null);
    this.branchs = [];
    this.commits = [];
    this.tags = [];
    Repositorio.value += 1;
    this.id = Repositorio.value;
  }

  adicionarPasta(nome: string): void {
    const novoDiretorio = new NoDiretorio(nome, this.raiz);
    this.raiz.criarFilho(novoDiretorio);
  }

  adicionarArquivo(nome: string, id: string, versao: Versao): void {
    const novoArquivo = new NoArquivo(nome, versao, this.raiz);
    this.raiz.criarFilho(novoArquivo);
  }

  getRaiz(): NoDiretorio {
    return this.raiz;
  }

  editarNomeRepositorio(novoNome: string): void {
    this.nome = novoNome;
  }
}

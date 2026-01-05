import { Branch } from "./branch";
import { Commit } from "./commit";
import { NoArquivo } from "./NoArquivo";
import { NoDiretorio } from "./NoDiretorio";
import { Versao } from "./Versao";

export class Repositorio {
  static value: number = 0;
  id: number;
  nome: string;
  branchs: Branch[];
  branchPrincipal: Branch | null;
  tags: string[];
  visibilidade: "publico" | "privado";
  descricao?: string;
  dataCriacao: string = new Date().toISOString().split("T")[0];
  constructor(
    nome: string,
    visibilidade: "publico" | "privado",
    descricao?: string
  ) {
    this.nome = nome;
    this.visibilidade = visibilidade || "privado";
    this.descricao = descricao;
    this.branchs = [];
    this.tags = [];
    Repositorio.value += 1;
    this.id = Repositorio.value;

    const main = this.criarBranch("main", new NoDiretorio("raiz", null));
    if (main) {
      main.principal = true;
      this.branchPrincipal = main;
    } else {
      this.branchPrincipal = null;
    }
  }

  editarNomeRepositorio(novoNome: string): void {
    this.nome = novoNome;
  }

  criarBranch(nome: string, raiz: NoDiretorio): Branch | void {
    if (this.getBranchByName(nome)) {
      return;
    }
    const novaBranch = new Branch(nome, raiz);
    this.branchs.push(novaBranch);
    return novaBranch;
  }

  getBranchs(): Branch[] {
    return this.branchs;
  }

  getBranchPrincipal(): Branch | null {
    return this.branchPrincipal;
  }

  getBranchByName(nome: string): Branch | undefined {
    return this.branchs.find((branch) => branch.nome === nome);
  }

  deletarBranch(nome: string): boolean {
    const branch = this.getBranchByName(nome);
    if (branch) {
      this.branchs = this.branchs.filter((b) => b.nome !== nome);
      return true;
    }
    return false;
  }

  getRaiz(): NoDiretorio {
    const mainBranch = this.getBranchByName("main");
    if (mainBranch) {
      return mainBranch.getRaiz();
    }
    throw new Error("Branch 'main' não encontrada.");
  }

  editarRepositorio(
    novoNome: string,
    novaVisibilidade: "publico" | "privado",
    novaDescricao?: string
  ): void {
    this.nome = novoNome;
    this.visibilidade = novaVisibilidade;
    this.descricao = novaDescricao;
  }
}

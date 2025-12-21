import { Repositorio } from "./Repositorio";
import { NoDiretorio } from "./NoDiretorio";

export class SistemaControleVersao {
  repositorios: Repositorio[];
  constructor() {
    this.repositorios = [];
  }
  createRepositorio(nome: string, raiz: NoDiretorio): Repositorio {
    const novoRepositorio = new Repositorio(nome, raiz);
    this.repositorios.push(novoRepositorio);
    return novoRepositorio;
  }

  getRepositorios(): Repositorio[] {
    return this.repositorios;
  }

  getRepositorioByName(nome: string): Repositorio | undefined {
    return this.repositorios.find((repositorio) => repositorio.nome === nome);
  }
}

import { Repositorio } from "./Repositorio";
import { NoDiretorio } from "./NoDiretorio";

export class SistemaControleVersao {
  repositorios: Repositorio[];
  constructor() {
    this.repositorios = [];
  }

  createRepositorio(nome: string): Repositorio {
    const novoRepositorio = new Repositorio(nome);
    this.repositorios.push(novoRepositorio);
    console.log("Criado");
    console.log(this.repositorios);
    return novoRepositorio;
  }

  getRepositorios(): Repositorio[] {
    return this.repositorios;
  }

  getRepositorioByName(nome: string): Repositorio | undefined {
    return this.repositorios.find((repositorio) => repositorio.nome === nome);
  }

  getRepositorioById(id: number): Repositorio | undefined {
    return this.repositorios.find((repositorio) => repositorio.id === id);
  }

  deleteRepositorio(nome: string): boolean {
    const repositorio = this.getRepositorioByName(nome);
    if (!repositorio) {
      return false;
    }
    this.repositorios = this.repositorios.filter(
      (repositorio) => repositorio.nome !== nome
    );
    return true;
  }
}

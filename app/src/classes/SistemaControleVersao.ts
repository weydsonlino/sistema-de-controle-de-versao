import { Repositorio } from "./Repositorio";

export class SistemaControleVersao {
  repositorios: Repositorio[];
  constructor() {
    this.repositorios = [];
  }

  createRepositorio(
    nome: string,
    visibilidade: "publico" | "privado",
    descricao?: string
  ): Repositorio {
    const novoRepositorio = new Repositorio(nome, visibilidade, descricao);
    this.repositorios.push(novoRepositorio);
    return novoRepositorio;
  }

  deleteRepositorioById(id: number): boolean {
    const repositorio = this.getRepositorioById(id);
    if (!repositorio) {
      return false;
    }
    this.repositorios = this.repositorios.filter(
      (repositorio) => repositorio.id !== id
    );
    return true;
  }
  getRepositorioByName(nome: string): Repositorio | undefined {
    return this.repositorios.find((repositorio) => repositorio.nome === nome);
  }

  getRepositorioById(id: number): Repositorio | undefined {
    return this.repositorios.find((repositorio) => repositorio.id === id);
  }
  getRepositorios(): Repositorio[] {
    return this.repositorios;
  }
}

import { NoDiretorio } from "./NoDiretorio";

export abstract class NoArvore {
  nome: string;
  caminho: string;
  pai: NoDiretorio | null;
  constructor(nome: string, pai: NoDiretorio | null) {
    this.nome = nome;
    this.pai = pai;
    this.caminho = pai ? `${pai.caminho}/${nome}` : nome;
  }
}

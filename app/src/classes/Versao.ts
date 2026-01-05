import { NoArquivo } from "./NoArquivo";

export class Versao {
  id: number;
  dataHora: string;
  tamanho: string;
  comentario: string;
  conteudo: string;
  hash: string;
  atual: boolean;
  file: NoArquivo;
  constructor(
    tamanho: string,
    comentario: string,
    conteudo: string,
    hash: string,
    file: NoArquivo
  ) {
    this.dataHora = new Date().toISOString();
    this.tamanho = tamanho;
    this.comentario = comentario;
    this.conteudo = conteudo;
    this.hash = hash;
    this.atual = true;
    this.file = file;
    console.log(file);
    this.id = file.versao.length + 1;
  }

  mudarVersaoAtual(atual: boolean): void {
    this.atual = atual;
  }
}

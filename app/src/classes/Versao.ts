export class Versao {
  id: number;
  dataHora: string;
  tamanho: number;
  comentario: string;
  conteudo: string;
  hash: string;
  constructor(
    id: number,
    dataHora: string,
    tamanho: number,
    comentario: string,
    conteudo: string,
    hash: string
  ) {
    this.id = id;
    this.dataHora = dataHora;
    this.tamanho = tamanho;
    this.comentario = comentario;
    this.conteudo = conteudo;
    this.hash = hash;
  }
}

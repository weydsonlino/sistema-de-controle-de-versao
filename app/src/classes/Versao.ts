export class Versao {
  id: number;
  dataHora: string;
  tamanho: number;
  comentario: string;
  conteudo: string;
  hash: string;
  atual: boolean;
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
    this.atual = true;
  }

  mudarVersaoAtual(atual: boolean): void {
    this.atual = atual;
  }
}

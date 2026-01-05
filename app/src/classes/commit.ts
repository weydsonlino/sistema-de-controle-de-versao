import { NoArquivo } from "./NoArquivo";

export class Commit {
  mensagem: string;
  autor: string;
  data: Date;
  arquivosModificados: NoArquivo[];
  constructor(
    mensagem: string,
    autor: string,
    arquivosModificados: NoArquivo[]
  ) {
    this.mensagem = mensagem;
    this.autor = autor;
    this.arquivosModificados = arquivosModificados;
    this.data = new Date();
  }

  getArquivosModificados(): NoArquivo[] {
    return this.arquivosModificados;
  }
}

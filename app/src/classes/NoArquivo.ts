import { NoArvore } from "./NoArvore";
import { Versao } from "./Versao";

export class NoArquivo extends NoArvore {
  versao: Versao[];
  constructor(nome: string, versao: Versao) {
    super(nome);
    this.versao = [];
    this.versao.push(versao);
  }

  getVersoes(): Versao[] {
    return this.versao;
  }

  adicionarVersao(versao: Versao): void {
    this.versao.push(versao);
  }
}

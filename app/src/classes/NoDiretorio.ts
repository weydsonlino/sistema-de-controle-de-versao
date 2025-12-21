import { NoArvore } from "./NoArvore";
export class NoDiretorio extends NoArvore {
  filhos: NoArvore[];
  constructor(nome: string) {
    super(nome);
    this.filhos = [];
  }

  criarFilho(filho: NoArvore): void {
    this.filhos.push(filho);
  }

  getFilhos(): NoArvore[] {
    return this.filhos;
  }

  getOneFilho(nome: string): NoArvore | undefined {
    return this.filhos.find((filho) => filho.nome === nome);
  }

  deleteFilho(nome: string): boolean {
    const filho = this.getOneFilho(nome);

    if (filho instanceof NoDiretorio) {
      if (filho.filhos.length > 0) {
        return false;
      }
    }

    this.filhos = this.filhos.filter((filho) => filho.nome !== nome);
    return true;
  }
}

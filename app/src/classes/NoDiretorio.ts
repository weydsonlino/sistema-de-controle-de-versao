import { NoArvore } from "./NoArvore";
export class NoDiretorio extends NoArvore {
  filhos: NoArvore[];
  constructor(nome: string, pai: NoDiretorio | null) {
    super(nome, pai);
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
      if (filho.getFilhos().length > 0) {
        return false;
      }
    }

    this.filhos = this.filhos.filter((filho) => filho.nome !== nome);
    return true;
  }

  editarNome(nome: string): void {
    this.nome = nome;
  }

  atualizarCaminho(): void {
    this.caminho = this.pai ? `${this.pai.caminho}/${this.nome}` : this.nome;
    for (let filho of this.filhos) {
      if (filho instanceof NoDiretorio) {
        filho.atualizarCaminho();
      } else {
        filho.caminho = `${this.caminho}/${filho.nome}`;
      }
    }
  }
}

import { NoArvore } from "./NoArvore";
export class NoDiretorio extends NoArvore {
  filhos: NoArvore[];
  constructor(nome: string, pai: NoDiretorio | null) {
    super(nome, pai);
    this.filhos = [];
  }

  buscarPorCaminho(caminho: string): NoArvore | null {
    const partes = caminho.split("/").filter(Boolean);
    return this.buscarRecursivo(partes);
  }

  private buscarRecursivo(partes: string[]): NoArvore | null {
    if (partes.length === 0) return this;
    //Retirar a gambiarra
    const [atual, ...resto] = partes;
    const filho = this.filhos.find((f) => f.nome === resto[0]);
    if (!filho) return null;

    if (filho instanceof NoDiretorio) {
      return filho.buscarRecursivo(resto);
    }

    return filho;
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
}

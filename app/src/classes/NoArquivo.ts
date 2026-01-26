import { NoArvore } from "./NoArvore";
import { NoDiretorio } from "./NoDiretorio";
import { Versao } from "./Versao";

export class NoArquivo extends NoArvore {
  versao: Versao[];
  ultimaMudança: String;
  constructor(nome: string, pai: NoDiretorio) {
    super(nome, pai);
    this.versao = [];
    this.ultimaMudança = new Date().toISOString();
  }

  alterarVersaoAtual(id: number): void {
    for (let v of this.versao) {
      if (v.id === id) {
        v.mudarVersaoAtual(true);
      } else {
        v.mudarVersaoAtual(false);
      }
    }
  }

  getVersoes(): Versao[] {
    return this.versao;
  }

  getUltimaVersao(): Versao | null {
    if (this.versao.length === 0) {
      return null;
    }
    return this.versao[this.versao.length - 1];
  }

  getVersaoAtual(): Versao {
    for (let i = this.versao.length - 1; i >= 0; i--) {
      if (this.versao[i].atual) {
        return this.versao[i];
      }
    }
    return this.versao[this.versao.length - 1];
  }

  adicionarVersao(versao: Versao): void {
    for (let v of this.versao) {
      v.mudarVersaoAtual(false);
    }
    versao.mudarVersaoAtual(true);
    this.versao.push(versao);
  }

  removerVersao(id: number): boolean {
    const index = this.versao.findIndex((v) => v.id === id);
    if (index !== -1) {
      this.versao.splice(index, 1);
      return true;
    }
    return false;
  }
}

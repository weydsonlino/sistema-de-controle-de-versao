import { NoArquivo } from "./NoArquivo";
import { Versao } from "./Versao";

export class Commit {
  autor: string = "";
  mensagem: string = "";
  dataHora: string = "";
  committed: boolean = false;

  // 🔑 SNAPSHOT
  snapshot: Map<NoArquivo, Versao> = new Map();

  constructor(arquivo: NoArquivo, versao: Versao) {
    this.snapshot.set(arquivo, versao);
    console.log(
      this.snapshot.forEach((v, a) => {
        console.log(`Arquivo: ${a.nome}, Versão ID: ${v.id}`);
      }),
    );
  }

  adicionarArquivoModificado(arquivo: NoArquivo, versao: Versao): void {
    this.snapshot.set(arquivo, versao);
    console.log(
      this.snapshot.forEach((v, a) => {
        console.log(`Arquivo: ${a.nome}, Versão ID: ${v.id}`);
      }),
    );
  }

  realizarCommit(autor: string, mensagem: string): void {
    this.autor = autor;
    this.mensagem = mensagem;
    this.dataHora = new Date().toISOString();
    this.committed = true;
  }
}

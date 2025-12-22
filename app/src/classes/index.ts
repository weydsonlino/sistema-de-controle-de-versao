import { SistemaControleVersao } from "./SistemaControleVersao";
import { NoDiretorio } from "./NoDiretorio";
import { NoArquivo } from "./NoArquivo";
import { Versao } from "./Versao";
import { Repositorio } from "./Repositorio";
const sistema = new SistemaControleVersao();

const appRepositorio = sistema.createRepositorio("app");
appRepositorio.adicionarPasta("src");
appRepositorio.adicionarPasta("tests");

const raizApp = appRepositorio.getRaiz();
const filhosRaizApp = raizApp.getFilhos();
console.log("Filhos do diretório raiz do repositório 'app':");
filhosRaizApp.forEach((filho) => console.log(filho.nome));

const srcFolder = raizApp.getOneFilho("src");
console.log("Diretório 'src':", srcFolder);

if (srcFolder instanceof NoDiretorio) {
  const arquivo = new NoArquivo(
    "index.ts",
    new Versao(
      1,
      "2024-06-01 10:00",
      1500,
      "Initial version",
      "Alice",
      "hash123"
    ),
    srcFolder
  );
  const classes = new NoDiretorio("classes", srcFolder);
  srcFolder.criarFilho(classes);
  console.log(
    "Filhos do diretório 'src':",
    srcFolder.getFilhos().map((filho) => filho.nome)
  );
  srcFolder.criarFilho(arquivo);
}

const app = sistema.getRepositorioByName("app");
app
  ?.getRaiz()
  .getFilhos()
  .forEach((filho) => {
    console.log("Filho do repositório 'app':", filho.nome);
  });

const src = app?.getRaiz().getOneFilho("src");
if (src instanceof NoDiretorio) {
  var indexFile = src.getOneFilho("index.ts");
  console.log(indexFile);
}

app?.getRaiz().deleteFilho("tests");
console.log(
  "Filhos do diretório raiz do repositório 'app' após deletar 'tests':",
  app
    ?.getRaiz()
    .getFilhos()
    .map((filho) => filho.nome)
);

appRepositorio
  .getRaiz()
  .criarFilho(new NoDiretorio("docs", appRepositorio.getRaiz()));
console.log(
  "Filhos do diretório raiz do repositório 'app' após adicionar 'docs':",
  appRepositorio
    .getRaiz()
    .getFilhos()
    .map((filho) => filho.nome)
);

sistema.createRepositorio("website");

console.log(Repositorio.value);

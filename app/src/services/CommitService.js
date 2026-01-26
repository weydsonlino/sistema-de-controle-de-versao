/**
 * CommitService
 * Gerencia operações de commits
 *
 * NOTA: Este é um mock service. Quando o backend estiver pronto,
 * substitua os retornos simulados por chamadas HTTP reais.
 */

// Dados mockados por repositório
const mockCommits = {};

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lista commits de um repositório
 * @param {string} repoId - ID do repositório
 * @param {number} limit - Número máximo de commits
 * @returns {Promise<Array>} Lista de commits
 */
export async function list(repoId, limit = 50) {
  await delay();
  const commits = mockCommits[repoId] || [];
  return commits.slice(0, limit);
}

/**
 * Busca commit por hash
 * @param {string} repoId - ID do repositório
 * @param {string} commitHash - Hash do commit
 * @returns {Promise<Object|null>} Commit encontrado ou null
 */
export async function getByHash(repoId, commitHash) {
  await delay();

  if (!mockCommits[repoId]) {
    return null;
  }

  return mockCommits[repoId].find((c) => c.hash === commitHash) || null;
}

/**
 * Reverte um commit
 * @param {string} repoId - ID do repositório
 * @param {string} commitHash - Hash do commit a reverter
 * @returns {Promise<Object>} Novo commit de revert
 */
export async function revert(repoId, commitHash) {
  await delay();

  if (!mockCommits[repoId]) {
    throw new Error("Repositório não encontrado");
  }

  const commit = mockCommits[repoId].find((c) => c.hash === commitHash);
  if (!commit) {
    throw new Error("Commit não encontrado");
  }

  // Criar commit de revert
  const revertCommit = {
    hash: Math.random().toString(36).substring(7),
    autor: "Usuário Atual",
    email: "usuario@example.com",
    data: new Date().toLocaleString("pt-BR"),
    mensagem: `Revert "${commit.mensagem}"`,
    arquivosAlterados: commit.arquivosAlterados,
  };

  // Adicionar no início da lista
  mockCommits[repoId].unshift(revertCommit);

  return revertCommit;
}

/**
 * Retorna diff de um commit
 * @param {string} repoId - ID do repositório
 * @param {string} commitHash - Hash do commit
 * @returns {Promise<Object>} Diff do commit
 */
export async function getDiff(repoId, commitHash) {
  await delay();

  const commit = await getByHash(repoId, commitHash);
  if (!commit) {
    throw new Error("Commit não encontrado");
  }

  // Simular diff
  return {
    hash: commitHash,
    arquivos: [
      {
        nome: "src/App.vue",
        adicionadas: 15,
        removidas: 8,
        diff: "+++ Linhas adicionadas\n--- Linhas removidas",
      },
      {
        nome: "src/components/Header.vue",
        adicionadas: 5,
        removidas: 2,
        diff: "+++ Linhas adicionadas\n--- Linhas removidas",
      },
    ],
  };
}

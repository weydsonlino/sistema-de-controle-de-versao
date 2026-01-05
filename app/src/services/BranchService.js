/**
 * BranchService
 * Gerencia operações de branches
 *
 * NOTA: Este é um mock service. Quando o backend estiver pronto,
 * substitua os retornos simulados por chamadas HTTP reais.
 */

// Dados mockados por repositório

import { SistemaControleVersao } from "../classes/SistemaControleVersao";
const sistema = new SistemaControleVersao();

const mockBranches = {
  1: [
    {
      nome: "main",
      ultimoCommit: "2024-12-19",
      autor: "João Silva",
      hash: "a1b2c3d",
    },
    {
      nome: "develop",
      ultimoCommit: "2024-12-18",
      autor: "Maria Santos",
      hash: "e4f5g6h",
    },
    {
      nome: "feature/login",
      ultimoCommit: "2024-12-17",
      autor: "João Silva",
      hash: "i7j8k9l",
    },
  ],
  2: [
    {
      nome: "main",
      ultimoCommit: "2024-12-18",
      autor: "Maria Santos",
      hash: "m1n2o3p",
    },
    {
      nome: "develop",
      ultimoCommit: "2024-12-16",
      autor: "João Silva",
      hash: "q4r5s6t",
    },
  ],
  3: [
    {
      nome: "main",
      ultimoCommit: "2024-12-20",
      autor: "João Silva",
      hash: "u7v8w9x",
    },
    {
      nome: "develop",
      ultimoCommit: "2024-12-19",
      autor: "Maria Santos",
      hash: "y1z2a3b",
    },
    {
      nome: "feature/dashboard",
      ultimoCommit: "2024-12-18",
      autor: "João Silva",
      hash: "c4d5e6f",
    },
    {
      nome: "feature/charts",
      ultimoCommit: "2024-12-17",
      autor: "Maria Santos",
      hash: "g7h8i9j",
    },
  ],
};

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Lista branches de um repositório
 * @param {string} repoId - ID do repositório
 * @returns {Promise<Array>} Lista de branches
 */
export async function list(repoId) {
  await delay();
  return mockBranches[repoId] || [];
}

/**
 * Cria uma nova branch
 * @param {string} repoId - ID do repositório
 * @param {string} branchName - Nome da branch
 * @param {string} fromCommit - Hash do commit de origem
 * @returns {Promise<Object>} Branch criada
 */
export async function create(repoId, branchName, fromCommit = "HEAD") {
  await delay();

  if (!mockBranches[repoId]) {
    mockBranches[repoId] = [];
  }

  // Verificar se branch já existe
  const exists = mockBranches[repoId].find((b) => b.nome === branchName);
  if (exists) {
    throw new Error("Branch já existe");
  }

  const newBranch = {
    nome: branchName,
    ultimoCommit: new Date().toISOString().split("T")[0],
    autor: "Usuário Atual",
    hash: Math.random().toString(36).substring(7),
  };

  mockBranches[repoId].push(newBranch);
  return newBranch;
}

/**
 * Remove uma branch
 * @param {string} repoId - ID do repositório
 * @param {string} branchName - Nome da branch
 * @returns {Promise<void>}
 */
export async function deleteBranch(repoId, branchName) {
  await delay();

  if (!mockBranches[repoId]) {
    throw new Error("Repositório não encontrado");
  }

  // Não permitir deletar main
  if (branchName === "main") {
    throw new Error("Não é possível deletar a branch main");
  }

  const index = mockBranches[repoId].findIndex((b) => b.nome === branchName);
  if (index === -1) {
    throw new Error("Branch não encontrada");
  }

  mockBranches[repoId].splice(index, 1);
}

/**
 * Faz merge entre branches
 * @param {string} repoId - ID do repositório
 * @param {string} source - Branch de origem
 * @param {string} target - Branch de destino
 * @returns {Promise<Object>} Resultado do merge
 */
export async function merge(repoId, source, target) {
  await delay();

  if (!mockBranches[repoId]) {
    throw new Error("Repositório não encontrado");
  }

  const sourceBranch = mockBranches[repoId].find((b) => b.nome === source);
  const targetBranch = mockBranches[repoId].find((b) => b.nome === target);

  if (!sourceBranch || !targetBranch) {
    throw new Error("Branch não encontrada");
  }

  // Simular merge bem-sucedido
  const hasConflicts = Math.random() > 0.8; // 20% de chance de conflito

  if (hasConflicts) {
    return {
      success: false,
      conflicts: ["src/App.vue", "src/components/Header.vue"],
      message: "Merge possui conflitos que precisam ser resolvidos",
    };
  }

  // Atualizar branch de destino
  targetBranch.ultimoCommit = new Date().toISOString().split("T")[0];
  targetBranch.hash = Math.random().toString(36).substring(7);

  return {
    success: true,
    message: `Merge de ${source} em ${target} realizado com sucesso`,
    newHash: targetBranch.hash,
  };
}

/**
 * Busca branch por nome
 * @param {string} repoId - ID do repositório
 * @param {string} branchName - Nome da branch
 * @returns {Promise<Object|null>} Branch encontrada ou null
 */
export async function getByName(repoId, branchName) {
  await delay();

  if (!mockBranches[repoId]) {
    return null;
  }

  return mockBranches[repoId].find((b) => b.nome === branchName) || null;
}

export async function getBranchs(repoId) {
  return sistema.getRepositorioById(Number(repoId)).getBranchs();
}

export async function getFolder(repoId, pastaAtual) {
  await delay();
  const repositorio = sistema.getRepositorioById(Number(repoId));
  const branch = repositorio.getBranchPrincipal();
  if (!branch) {
    throw new Error("Branch principal não encontrada");
  }
  const files = branch.getRaiz().getFilhos();
}

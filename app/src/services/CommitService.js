/**
 * CommitService
 * Gerencia operações de commits
 * 
 * NOTA: Este é um mock service. Quando o backend estiver pronto,
 * substitua os retornos simulados por chamadas HTTP reais.
 */

// Dados mockados por repositório
const mockCommits = {
    '1': [
        {
            hash: 'a1b2c3d',
            autor: 'João Silva',
            email: 'joao@example.com',
            data: '2024-12-19 14:30',
            mensagem: 'feat: adiciona autenticação de usuários',
            arquivosAlterados: 5
        },
        {
            hash: 'e4f5g6h',
            autor: 'Maria Santos',
            email: 'maria@example.com',
            data: '2024-12-18 10:15',
            mensagem: 'fix: corrige bug no login',
            arquivosAlterados: 2
        },
        {
            hash: 'i7j8k9l',
            autor: 'João Silva',
            email: 'joao@example.com',
            data: '2024-12-17 16:45',
            mensagem: 'refactor: reorganiza estrutura de componentes',
            arquivosAlterados: 12
        }
    ],
    '2': [
        {
            hash: 'm1n2o3p',
            autor: 'Maria Santos',
            email: 'maria@example.com',
            data: '2024-12-18 09:00',
            mensagem: 'feat: implementa endpoint de usuários',
            arquivosAlterados: 4
        },
        {
            hash: 'q4r5s6t',
            autor: 'João Silva',
            email: 'joao@example.com',
            data: '2024-12-16 11:20',
            mensagem: 'docs: atualiza documentação da API',
            arquivosAlterados: 1
        }
    ],
    '3': [
        {
            hash: 'u7v8w9x',
            autor: 'João Silva',
            email: 'joao@example.com',
            data: '2024-12-20 08:30',
            mensagem: 'feat: adiciona gráficos ao dashboard',
            arquivosAlterados: 8
        },
        {
            hash: 'y1z2a3b',
            autor: 'Maria Santos',
            email: 'maria@example.com',
            data: '2024-12-19 15:00',
            mensagem: 'style: melhora responsividade mobile',
            arquivosAlterados: 6
        },
        {
            hash: 'c4d5e6f',
            autor: 'João Silva',
            email: 'joao@example.com',
            data: '2024-12-18 13:45',
            mensagem: 'feat: implementa filtros avançados',
            arquivosAlterados: 3
        }
    ]
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

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

    return mockCommits[repoId].find(c => c.hash === commitHash) || null;
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
        throw new Error('Repositório não encontrado');
    }

    const commit = mockCommits[repoId].find(c => c.hash === commitHash);
    if (!commit) {
        throw new Error('Commit não encontrado');
    }

    // Criar commit de revert
    const revertCommit = {
        hash: Math.random().toString(36).substring(7),
        autor: 'Usuário Atual',
        email: 'usuario@example.com',
        data: new Date().toLocaleString('pt-BR'),
        mensagem: `Revert "${commit.mensagem}"`,
        arquivosAlterados: commit.arquivosAlterados
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
        throw new Error('Commit não encontrado');
    }

    // Simular diff
    return {
        hash: commitHash,
        arquivos: [
            {
                nome: 'src/App.vue',
                adicionadas: 15,
                removidas: 8,
                diff: '+++ Linhas adicionadas\n--- Linhas removidas'
            },
            {
                nome: 'src/components/Header.vue',
                adicionadas: 5,
                removidas: 2,
                diff: '+++ Linhas adicionadas\n--- Linhas removidas'
            }
        ]
    };
}

/**
 * RepoService
 * Gerencia operações relacionadas a repositórios
 * 
 * NOTA: Este é um mock service. Quando o backend estiver pronto,
 * substitua os retornos simulados por chamadas HTTP reais (fetch/axios).
 */

// Dados mockados
const mockRepos = [
    {
        id: '1',
        nome: 'projeto-sistema-v1',
        descricao: 'Sistema de controle de versão principal',
        visibilidade: 'privado',
        tipo: 'git',
        dono: 'João Silva',
        dataCriacao: '2024-01-15',
        ultimoCommit: '2024-12-19',
        branches: 5,
        tags: 3,
        commits: 127
    },
    {
        id: '2',
        nome: 'api-gestao-dados',
        descricao: 'API REST para gestão de dados',
        visibilidade: 'publico',
        tipo: 'git',
        dono: 'Maria Santos',
        dataCriacao: '2024-03-20',
        ultimoCommit: '2024-12-18',
        branches: 3,
        tags: 2,
        commits: 84
    },
    {
        id: '3',
        nome: 'frontend-dashboard',
        descricao: 'Dashboard administrativo em Vue.js',
        visibilidade: 'privado',
        tipo: 'git',
        dono: 'João Silva',
        dataCriacao: '2024-06-10',
        ultimoCommit: '2024-12-20',
        branches: 7,
        tags: 5,
        commits: 203
    }
];

/**
 * Simula delay de rede
 */
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Cria um novo repositório
 * @param {Object} data - Dados do repositório
 * @param {string} data.nome - Nome do repositório
 * @param {string} data.descricao - Descrição
 * @param {string} data.visibilidade - 'publico' ou 'privado'
 * @param {string} data.template - Template inicial
 * @returns {Promise<Object>} Repositório criado
 */
export async function createRepo(data) {
    await delay();

    const newRepo = {
        id: String(mockRepos.length + 1),
        nome: data.nome,
        descricao: data.descricao || '',
        visibilidade: data.visibilidade || 'privado',
        tipo: 'git',
        dono: 'Usuário Atual',
        dataCriacao: new Date().toISOString().split('T')[0],
        ultimoCommit: new Date().toISOString().split('T')[0],
        branches: 1,
        tags: 0,
        commits: 1
    };

    mockRepos.push(newRepo);
    return newRepo;
}

/**
 * Busca e filtra repositórios
 * @param {string} query - Termo de busca
 * @param {Object} filters - Filtros (visibilidade, tipo)
 * @param {number} page - Página atual (1-indexed)
 * @param {number} size - Itens por página
 * @returns {Promise<Object>} Resultado paginado
 */
export async function search(query = '', filters = {}, page = 1, size = 10) {
    await delay();

    let filtered = [...mockRepos];

    // Filtrar por query
    if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(repo =>
            repo.nome.toLowerCase().includes(lowerQuery) ||
            repo.descricao.toLowerCase().includes(lowerQuery)
        );
    }

    // Filtrar por visibilidade
    if (filters.visibilidade) {
        filtered = filtered.filter(repo => repo.visibilidade === filters.visibilidade);
    }

    // Filtrar por tipo
    if (filters.tipo) {
        filtered = filtered.filter(repo => repo.tipo === filters.tipo);
    }

    // Paginação
    const total = filtered.length;
    const totalPages = Math.ceil(total / size);
    const start = (page - 1) * size;
    const end = start + size;
    const items = filtered.slice(start, end);

    return {
        items,
        page,
        size,
        total,
        totalPages
    };
}

/**
 * Busca repositório por ID
 * @param {string} id - ID do repositório
 * @returns {Promise<Object|null>} Repositório encontrado ou null
 */
export async function getById(id) {
    await delay();
    return mockRepos.find(repo => repo.id === id) || null;
}

/**
 * Atualiza um repositório
 * @param {string} id - ID do repositório
 * @param {Object} data - Dados a atualizar
 * @returns {Promise<Object>} Repositório atualizado
 */
export async function updateRepo(id, data) {
    await delay();

    const index = mockRepos.findIndex(repo => repo.id === id);
    if (index === -1) {
        throw new Error('Repositório não encontrado');
    }

    mockRepos[index] = {
        ...mockRepos[index],
        ...data
    };

    return mockRepos[index];
}

/**
 * Remove um repositório
 * @param {string} id - ID do repositório
 * @returns {Promise<void>}
 */
export async function deleteRepo(id) {
    await delay();

    const index = mockRepos.findIndex(repo => repo.id === id);
    if (index === -1) {
        throw new Error('Repositório não encontrado');
    }

    mockRepos.splice(index, 1);
}

/**
 * Retorna URL de clone do repositório
 * @param {string} id - ID do repositório
 * @returns {Promise<string>} URL de clone
 */
export async function getCloneUrl(id) {
    await delay();

    const repo = mockRepos.find(r => r.id === id);
    if (!repo) {
        throw new Error('Repositório não encontrado');
    }

    return `git@github.com:usuario/${repo.nome}.git`;
}

/**
 * Retorna todos os repositórios (para dashboard)
 * @returns {Promise<Array>} Lista de repositórios
 */
export async function getAll() {
    await delay();
    return [...mockRepos];
}

/**
 * Retorna estatísticas gerais
 * @returns {Promise<Object>} Estatísticas
 */
export async function getStats() {
    await delay();

    return {
        totalRepos: mockRepos.length,
        totalCommits: mockRepos.reduce((sum, repo) => sum + repo.commits, 0),
        totalBranches: mockRepos.reduce((sum, repo) => sum + repo.branches, 0),
        totalTags: mockRepos.reduce((sum, repo) => sum + repo.tags, 0)
    };
}

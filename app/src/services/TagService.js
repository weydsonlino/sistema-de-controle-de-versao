/**
 * TagService
 * Gerencia tags do repositório
 * 
 * NOTA: Este é um mock service. Quando o backend estiver pronto,
 * substitua os retornos simulados por chamadas HTTP reais.
 */

// Dados mockados por repositório
const mockTags = {
    '1': [
        { nome: 'v1.0.0', commitHash: 'a1b2c3d', data: '2024-10-15', autor: 'João Silva' },
        { nome: 'v1.1.0', commitHash: 'e4f5g6h', data: '2024-11-20', autor: 'Maria Santos' },
        { nome: 'v1.2.0', commitHash: 'i7j8k9l', data: '2024-12-10', autor: 'João Silva' }
    ],
    '2': [
        { nome: 'v0.1.0', commitHash: 'm1n2o3p', data: '2024-08-05', autor: 'Maria Santos' },
        { nome: 'v0.2.0', commitHash: 'q4r5s6t', data: '2024-10-12', autor: 'João Silva' }
    ],
    '3': [
        { nome: 'v2.0.0', commitHash: 'u7v8w9x', data: '2024-09-01', autor: 'João Silva' },
        { nome: 'v2.1.0', commitHash: 'y1z2a3b', data: '2024-10-15', autor: 'Maria Santos' },
        { nome: 'v2.2.0', commitHash: 'c4d5e6f', data: '2024-11-20', autor: 'João Silva' },
        { nome: 'v2.3.0', commitHash: 'g7h8i9j', data: '2024-12-05', autor: 'Maria Santos' }
    ]
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Lista tags de um repositório
 * @param {string} repoId - ID do repositório
 * @returns {Promise<Array>} Lista de tags
 */
export async function list(repoId) {
    await delay();
    return mockTags[repoId] || [];
}

/**
 * Cria uma nova tag
 * @param {string} repoId - ID do repositório
 * @param {string} tagName - Nome da tag (ex: v1.0.0)
 * @param {string} commitHash - Hash do commit
 * @returns {Promise<Object>} Tag criada
 */
export async function create(repoId, tagName, commitHash) {
    await delay();

    if (!mockTags[repoId]) {
        mockTags[repoId] = [];
    }

    // Verificar se tag já existe
    const exists = mockTags[repoId].find(t => t.nome === tagName);
    if (exists) {
        throw new Error('Tag já existe');
    }

    const newTag = {
        nome: tagName,
        commitHash: commitHash || Math.random().toString(36).substring(7),
        data: new Date().toISOString().split('T')[0],
        autor: 'Usuário Atual'
    };

    mockTags[repoId].push(newTag);
    return newTag;
}

/**
 * Remove uma tag
 * @param {string} repoId - ID do repositório
 * @param {string} tagName - Nome da tag
 * @returns {Promise<void>}
 */
export async function deleteTag(repoId, tagName) {
    await delay();

    if (!mockTags[repoId]) {
        throw new Error('Repositório não encontrado');
    }

    const index = mockTags[repoId].findIndex(t => t.nome === tagName);
    if (index === -1) {
        throw new Error('Tag não encontrada');
    }

    mockTags[repoId].splice(index, 1);
}

/**
 * Busca tag por nome
 * @param {string} repoId - ID do repositório
 * @param {string} tagName - Nome da tag
 * @returns {Promise<Object|null>} Tag encontrada ou null
 */
export async function getByName(repoId, tagName) {
    await delay();

    if (!mockTags[repoId]) {
        return null;
    }

    return mockTags[repoId].find(t => t.nome === tagName) || null;
}

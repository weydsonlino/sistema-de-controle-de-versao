/**
 * UserService
 * Gerencia configurações de usuário
 * 
 * NOTA: Este é um mock service. Quando o backend estiver pronto,
 * substitua os retornos simulados por chamadas HTTP reais.
 */

// Dados mockados do usuário
let mockUser = {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=3b82f6&color=fff',
    tema: 'dark',
    preferencias: {
        itensPorPagina: 10,
        idioma: 'pt-BR'
    }
};

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retorna dados do usuário atual
 * @returns {Promise<Object>} Dados do usuário
 */
export async function getCurrentUser() {
    await delay();
    return { ...mockUser };
}

/**
 * Atualiza perfil do usuário
 * @param {Object} data - Dados a atualizar
 * @param {string} data.nome - Nome do usuário
 * @param {string} data.email - Email
 * @param {string} data.avatar - URL do avatar
 * @returns {Promise<Object>} Usuário atualizado
 */
export async function updateProfile(data) {
    await delay();

    mockUser = {
        ...mockUser,
        ...data
    };

    return { ...mockUser };
}

/**
 * Alterna tema (claro/escuro)
 * @param {string} theme - 'light' ou 'dark'
 * @returns {Promise<void>}
 */
export async function setTheme(theme) {
    await delay();

    if (theme !== 'light' && theme !== 'dark') {
        throw new Error('Tema inválido. Use "light" ou "dark"');
    }

    mockUser.tema = theme;

    // Aplicar tema no DOM
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    // Salvar no localStorage
    localStorage.setItem('theme', theme);
}

/**
 * Carrega tema salvo
 * @returns {string} Tema atual
 */
export function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    mockUser.tema = savedTheme;
    return savedTheme;
}

/**
 * Atualiza preferências do usuário
 * @param {Object} preferencias - Preferências a atualizar
 * @returns {Promise<Object>} Preferências atualizadas
 */
export async function updatePreferences(preferencias) {
    await delay();

    mockUser.preferencias = {
        ...mockUser.preferencias,
        ...preferencias
    };

    // Salvar no localStorage
    localStorage.setItem('userPreferences', JSON.stringify(mockUser.preferencias));

    return { ...mockUser.preferencias };
}

/**
 * Carrega preferências salvas
 * @returns {Object} Preferências
 */
export function loadPreferences() {
    const saved = localStorage.getItem('userPreferences');

    if (saved) {
        try {
            mockUser.preferencias = JSON.parse(saved);
        } catch (e) {
            console.error('Erro ao carregar preferências:', e);
        }
    }

    return { ...mockUser.preferencias };
}

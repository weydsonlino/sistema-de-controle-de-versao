<template>
  <header class="top-bar">
    <div class="logo" @click="$router.push('/dashboard')">
      <i class="fas fa-terminal"></i>
      <div class="brand-text">
        <span class="name">Versions Control</span>
      </div>
    </div>
    
    <nav class="nav-links">
      <router-link to="/dashboard" class="nav-link">
        <i class="fas fa-home"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/repos" class="nav-link">
        <i class="fas fa-folder"></i>
        <span>Repositórios</span>
      </router-link>
    </nav>
    
    <div class="actions">
      <button class="btn-icon" @click="toggleTheme" :aria-label="isDark ? 'Modo claro' : 'Modo escuro'">
        <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
      </button>
      
      <button class="btn-primary" @click="$emit('create-repo')" aria-label="Criar novo repositório">
        <i class="fas fa-plus"></i>
        <span>Novo Repositório</span>
      </button>
      
      <div class="user-menu" @click="toggleUserMenu">
        <img :src="user.avatar" :alt="user.nome" class="user-avatar" />
        <i class="fas fa-chevron-down"></i>
        
        <div v-if="showUserMenu" class="dropdown">
          <router-link to="/perfil" class="dropdown-item">
            <i class="fas fa-user"></i>
            <span>Perfil</span>
          </router-link>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i>
            <span>Sair</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as UserService from '../../services/UserService';

defineEmits(['create-repo']);

const user = ref({
  nome: 'Usuário',
  avatar: 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'
});

const isDark = ref(true);
const showUserMenu = ref(false);

onMounted(async () => {
  // Carregar tema salvo
  const theme = UserService.loadTheme();
  isDark.value = theme === 'dark';
  
  // Carregar dados do usuário
  try {
    const userData = await UserService.getCurrentUser();
    user.value = userData;
  } catch (error) {
    console.error('Erro ao carregar usuário:', error);
  }
});

const toggleTheme = async () => {
  const newTheme = isDark.value ? 'light' : 'dark';
  isDark.value = !isDark.value;
  
  try {
    await UserService.setTheme(newTheme);
  } catch (error) {
    console.error('Erro ao alterar tema:', error);
  }
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const handleLogout = () => {
  console.log('Logout');
  showUserMenu.value = false;
};

// Fechar menu ao clicar fora
import { onBeforeUnmount } from 'vue';

const handleClickOutside = (event) => {
  if (!event.target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.top-bar {
  height: 64px;
  background-color: var(--bg-surface);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.logo:hover {
  opacity: 0.8;
}

.logo i {
  font-size: 1.5rem;
  color: var(--color-primary-500);
}

.brand-text .name {
  font-weight: var(--font-weight-black);
  font-size: var(--font-size-lg);
  letter-spacing: -0.025em;
  color: var(--text-primary);
}

.nav-links {
  display: flex;
  gap: var(--space-2);
  flex: 1;
  margin-left: var(--space-8);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  text-decoration: none;
}

.nav-link:hover {
  background-color: var(--bg-elevated);
  color: var(--text-primary);
}

.nav-link.router-link-active {
  background-color: var(--bg-elevated);
  color: var(--color-primary-500);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.btn-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon:hover {
  background-color: var(--bg-elevated);
  color: var(--text-primary);
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.user-menu:hover {
  background-color: var(--bg-elevated);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 2px solid var(--border-medium);
}

.user-menu i {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  min-width: 200px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-2);
  z-index: var(--z-dropdown);
  animation: slideUp var(--transition-base);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: var(--bg-elevated);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--border-subtle);
  margin: var(--space-2) 0;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 0 var(--space-4);
  }
  
  .nav-links {
    display: none;
  }
  
  .btn-primary span {
    display: none;
  }
}
</style>
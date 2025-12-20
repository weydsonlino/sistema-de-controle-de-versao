<template>
  <div class="app-container">
    <HeaderBar @create-repo="handleCreateRepo" />
    <main class="content-wrapper">
      <section class="hero-section">
        <h1>Seus Repositórios</h1>
        <p>Gerencie seus projetos de forma eficiente, organizada e profissional.</p>
      </section>
      <div class="repo-grid">
        <div v-for="repo in repositorios" :key="repo.nome" class="repo-card">
          <div class="card-header">
            <i class="fas fa-folder-open repo-icon"></i>
            <div class="meta">
              <h3>{{ repo.nome }}</h3>
              <span class="root-label">/home/user/projects/{{ repo.nome }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-primary" @click="handleOpenRepo(repo)">
              <i class="fas fa-external-link-alt"></i>
              <span>Acessar</span>
            </button>
            <button class="btn-outline" @click="handleDeleteRepo(repo)">
              <i class="fas fa-eraser"></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBar from '../components/HeaderBar.vue';

const router = useRouter();

const repositorios = ref([
  { nome: 'projeto-sistema-v1' },
  { nome: 'api-gestao-dados' }
]);

const handleCreateRepo = () => {
  const nome = prompt("Nome do novo repositório:");
  if (nome) {
    repositorios.value.push({ nome });
  }
};

const handleOpenRepo = (repo) => {
  console.log('Botão "Acessar Projeto" clicado para repositório:', repo);
  console.log('Tentando navegar para /repositorio');
  router.push('/repositorio');
  console.log('Navegação executada');
};

const handleDeleteRepo = (repo) => {
  if (confirm(`Tem certeza que deseja deletar o repositório "${repo.nome}"?`)) {
    repositorios.value = repositorios.value.filter(r => r.nome !== repo.nome);
  }
};
</script>

<style scoped>
/* Variáveis de Design Tokens */
:root {
  --bg-deep: #0a0a0a;
  --bg-surface: #121212;
  --border-subtle: #262626;
  --accent-blue: #3b82f6;
  --text-main: #f5f5f5;
  --text-dim: #a3a3a3;
}

.app-container {
  min-height: 100vh;
  background-color: var(--bg-deep, #0a0a0a);
  color: var(--text-main, #f5f5f5);
  font-family: 'Inter', system-ui, sans-serif;
  width: 100%;
  overflow-x: hidden;
}

/* Conteúdo Principal */
.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 30px;
  box-sizing: border-box;
}

.hero-section {
  margin-bottom: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 20px 0;
}

.hero-section h1 {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 12px;
}

.hero-section p {
  color: var(--text-dim, #a3a3a3);
  max-width: 600px;
  line-height: 1.6;
}

/* Grid de Repositórios */
.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
  width: 100%;
}

.repo-card {
  background: var(--bg-surface, #121212);
  border: 1px solid var(--border-subtle, #262626);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.repo-card:hover {
  border-color: var(--accent-blue, #643bf6);
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.5);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.repo-icon {
  font-size: 2rem;
  color: #fbbf24; /* Amarelo para simbolizar estrutura/banco */
}

.meta h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.root-label {
  font-size: 0.8rem;
  color: var(--text-dim, #a3a3a3);
}

.card-actions {
  display: flex;
  gap: 12px;
}

/* Botões Profissionais */
.btn-primary {
  background-color: var(--accent-blue, #643bf6);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: filter 0.2s;
}

.btn-primary:hover {
  filter: brightness(1.2);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--border-subtle, #262626);
  color: var(--text-main, #f5f5f5);
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: var(--text-main, #f5f5f5);
  color: var(--bg-deep, #0a0a0a);
}

/* Responsividade */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 30px;
    max-width: 100%;
  }

  .hero-section {
    min-height: 150px;
    padding: 15px 0;
  }

  .hero-section h1 {
    font-size: 2rem;
  }

  .repo-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 20px 15px;
  }

  .hero-section h1 {
    font-size: 1.8rem;
  }

  .repo-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .repo-card {
    padding: 16px;
  }
}
</style>
<template>
  <div class="repo-list-container">
    <HeaderBar @create-repo="showCreateModal = true" />
    
    <main class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-8);">
      <section class="hero-section">
        <h1>Repositórios</h1>
        <p>Gerencie todos os seus repositórios</p>
      </section>
      
      <!-- Search and Filters -->
      <div class="filters-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar repositórios..."
            class="input-field"
            @input="handleSearch"
          />
        </div>
        
        <div class="filters">
          <select v-model="filters.visibilidade" class="input-field" @change="handleSearch">
            <option value="">Todas Visibilidades</option>
            <option value="publico">Público</option>
            <option value="privado">Privado</option>
          </select>
          
          <select v-model="filters.tipo" class="input-field" @change="handleSearch">
            <option value="">Todos os Tipos</option>
            <option value="git">Git</option>
            <option value="svn">SVN</option>
          </select>
        </div>
      </div>
      
      <!-- Loading State -->
      <LoadingSpinner v-if="loading" message="Carregando repositórios..." />
      
      <!-- Table -->
      <div v-else-if="result.items.length > 0" class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th class="sortable" @click="toggleSort('nome')">
                Nome
                <i v-if="sortBy === 'nome'" :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
              </th>
              <th>Descrição</th>
              <th class="sortable" @click="toggleSort('commits')">
                Commits
                <i v-if="sortBy === 'commits'" :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
              </th>
              <th>Branches</th>
              <th>Tags</th>
              <th>Visibilidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="repo in sortedRepos" :key="repo.id">
              <td>
                <div style="display: flex; align-items: center; gap: var(--space-3);">
                  <i class="fas fa-folder" style="color: var(--color-warning);"></i>
                  <strong>{{ repo.nome }}</strong>
                </div>
              </td>
              <td>
                <span class="truncate" style="max-width: 300px; display: block;">
                  {{ repo.descricao || '—' }}
                </span>
              </td>
              <td>{{ repo.commits }}</td>
              <td>{{ repo.branches }}</td>
              <td>{{ repo.tags }}</td>
              <td>
                <span class="badge" :class="repo.visibilidade === 'publico' ? 'badge-success' : 'badge-primary'">
                  {{ repo.visibilidade }}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: var(--space-2);">
                  <Button size="sm" variant="primary" @click="openRepo(repo.id)">
                    <i class="fas fa-eye"></i>
                  </Button>
                  <Button size="sm" variant="outline" @click="editRepo(repo.id)">
                    <i class="fas fa-edit"></i>
                  </Button>
                  <Button size="sm" variant="danger" @click="deleteRepo(repo.id)">
                    <i class="fas fa-trash"></i>
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination -->
        <Pagination
          v-model:current-page="currentPage"
          :total-pages="result.totalPages"
          @update:current-page="handlePageChange"
        />
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state">
        <i class="fas fa-folder-open" style="font-size: 4rem; color: var(--text-tertiary);"></i>
        <h3>Nenhum repositório encontrado</h3>
        <p>Crie seu primeiro repositório para começar</p>
        <Button variant="primary" @click="showCreateModal = true">
          <i class="fas fa-plus"></i>
          Criar Repositório
        </Button>
      </div>
    </main>
    
    <!-- Create Repo Modal -->
    <Modal v-model="showCreateModal" title="Criar Novo Repositório" width="500px">
      <form @submit.prevent="handleCreateRepo">
        <FormField
          v-model="newRepo.nome"
          label="Nome do Repositório"
          placeholder="meu-projeto"
          required
          :error="errors.nome"
        />
        
        <FormField
          v-model="newRepo.descricao"
          label="Descrição"
          type="textarea"
          placeholder="Descrição do projeto..."
          :rows="3"
        />
        
        <FormField
          v-model="newRepo.visibilidade"
          label="Visibilidade"
          type="select"
          required
          :options="[
            { label: 'Privado', value: 'privado' },
            { label: 'Público', value: 'publico' }
          ]"
        />
      </form>
      
      <template #footer>
        <Button variant="outline" @click="showCreateModal = false">
          Cancelar
        </Button>
        <Button variant="primary" :loading="creating" @click="handleCreateRepo">
          Criar Repositório
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HeaderBar from '../components/layout/HeaderBar.vue';
import Button from '../components/common/Button.vue';
import Modal from '../components/common/Modal.vue';
import FormField from '../components/common/FormField.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import Pagination from '../components/common/Pagination.vue';
import * as RepoService from '../services/RepoService';

const router = useRouter();

const loading = ref(true);
const creating = ref(false);
const searchQuery = ref('');
const filters = ref({
  visibilidade: '',
  tipo: ''
});
const currentPage = ref(1);
const pageSize = 10;
const result = ref({
  items: [],
  total: 0,
  totalPages: 0
});
const sortBy = ref('nome');
const sortOrder = ref('asc');
const showCreateModal = ref(false);
const newRepo = ref({
  nome: '',
  descricao: '',
  visibilidade: 'privado'
});
const errors = ref({});

const sortedRepos = computed(() => {
  const repos = [...result.value.items];
  repos.sort((a, b) => {
    const aVal = a[sortBy.value];
    const bVal = b[sortBy.value];
    
    if (typeof aVal === 'string') {
      return sortOrder.value === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return sortOrder.value === 'asc'
      ? aVal - bVal
      : bVal - aVal;
  });
  return repos;
});

onMounted(async () => {
  await loadRepos();
});

const loadRepos = async () => {
  loading.value = true;
  try {
    const data = await RepoService.search(
      searchQuery.value,
      filters.value,
      currentPage.value,
      pageSize
    );
    result.value = data;
  } catch (error) {
    console.error('Erro ao carregar repositórios:', error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadRepos();
};

const handlePageChange = () => {
  loadRepos();
};

const toggleSort = (field) => {
  if (sortBy.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = field;
    sortOrder.value = 'asc';
  }
};

const handleCreateRepo = async () => {
  errors.value = {};
  
  if (!newRepo.value.nome) {
    errors.value.nome = 'Nome é obrigatório';
    return;
  }
  
  creating.value = true;
  try {
    await RepoService.createRepo(newRepo.value);
    showCreateModal.value = false;
    newRepo.value = { nome: '', descricao: '', visibilidade: 'privado' };
    await loadRepos();
  } catch (error) {
    console.error('Erro ao criar repositório:', error);
    errors.value.nome = error.message;
  } finally {
    creating.value = false;
  }
};

const openRepo = (id) => {
  router.push(`/repos/${id}`);
};

const editRepo = (id) => {
  router.push(`/repos/${id}/editar`);
};

const deleteRepo = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este repositório?')) {
    return;
  }
  
  try {
    await RepoService.deleteRepo(id);
    await loadRepos();
  } catch (error) {
    console.error('Erro ao deletar repositório:', error);
    alert('Erro ao deletar repositório');
  }
};
</script>

<style scoped>
.repo-list-container {
  min-height: 100vh;
  background-color: var(--bg-deep);
}

.hero-section {
  text-align: center;
  margin-bottom: var(--space-8);
}

.hero-section h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-black);
  margin-bottom: var(--space-3);
  color: var(--text-primary);
}

.hero-section p {
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  margin: 0;
}

.filters-section {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

.search-box input {
  padding-left: var(--space-10);
}

.filters {
  display: flex;
  gap: var(--space-3);
}

.filters select {
  min-width: 180px;
}

.table-container {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-8);
}

.empty-state h3 {
  margin: var(--space-6) 0 var(--space-3) 0;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: var(--space-6);
}

@media (max-width: 1024px) {
  .filters-section {
    gap: var(--space-3);
  }
  
  .filters select {
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: var(--font-size-3xl);
  }
  
  .hero-section p {
    font-size: var(--font-size-base);
  }
  
  .filters-section {
    flex-direction: column;
    gap: var(--space-3);
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .filters {
    flex-direction: column;
    width: 100%;
  }
  
  .filters select {
    width: 100%;
    min-width: 100%;
  }
  
  .table-container {
    overflow-x: auto;
    border-radius: var(--radius-md);
  }
  
  .table {
    min-width: 800px;
  }
  
  .table th,
  .table td {
    padding: var(--space-3);
    font-size: var(--font-size-sm);
  }
  
  .empty-state {
    padding: var(--space-12) var(--space-4);
  }
  
  .empty-state h3 {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .hero-section {
    margin-bottom: var(--space-6);
  }
  
  .hero-section h1 {
    font-size: var(--font-size-2xl);
  }
  
  .filters-section {
    margin-bottom: var(--space-6);
  }
  
  .search-box input {
    font-size: var(--font-size-sm);
  }
  
  .table th,
  .table td {
    padding: var(--space-2);
    font-size: var(--font-size-xs);
  }
  
  .empty-state {
    padding: var(--space-8) var(--space-4);
  }
  
  .empty-state i {
    font-size: 3rem !important;
  }
}
</style>

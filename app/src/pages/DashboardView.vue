<template>
  <div class="dashboard-container">
    <HeaderBar @create-repo="showCreateModal = true" />

    <main
      class="container"
      style="padding-top: var(--space-8); padding-bottom: var(--space-8)"
    >
      <!-- Hero Section -->
      <section class="hero-section">
        <h1>Dashboard</h1>
        <p>Visão geral dos seus repositórios e atividades recentes</p>
      </section>

      <!-- Loading State -->
      <LoadingSpinner v-if="loading" message="Carregando dados..." />

      <!-- Metrics -->
      <div v-else>
        <div class="metrics-grid">
          <MetricCard
            label="Total de Repositórios"
            :value="stats.totalRepos"
            icon="fas fa-folder"
            iconColor="var(--color-primary-500)"
          />
          <MetricCard
            label="Total de Commits"
            :value="stats.totalCommits"
            icon="fas fa-code-commit"
            iconColor="var(--color-secondary-500)"
          />
          <MetricCard
            label="Branches Ativos"
            :value="stats.totalBranches"
            icon="fas fa-code-branch"
            iconColor="var(--color-warning)"
          />
          <MetricCard
            label="Tags Criadas"
            :value="stats.totalTags"
            icon="fas fa-tag"
            iconColor="var(--color-success)"
          />
        </div>

        <!-- Recent Repositories -->
        <section style="margin-top: var(--space-12)">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: var(--space-6);
            "
          >
            <h2>Repositórios Recentes</h2>
            <Button variant="outline" @click="$router.push('/repos')">
              Ver Todos
              <i class="fas fa-arrow-right"></i>
            </Button>
          </div>

          <div class="repo-grid">
            <div v-for="repo in repositories" :key="repo.id" class="repo-card">
              <div class="card-header">
                <i
                  class="fas fa-folder-open"
                  style="font-size: 2rem; color: var(--color-warning)"
                ></i>
                <div style="flex: 1">
                  <h3>{{ repo.nome }}</h3>
                  <p
                    style="
                      font-size: var(--font-size-sm);
                      color: var(--text-tertiary);
                      margin: 0;
                    "
                  >
                    {{ repo.descricao || "Sem descrição" }}
                  </p>
                </div>
              </div>

              <div
                style="
                  display: flex;
                  gap: var(--space-4);
                  font-size: var(--font-size-sm);
                  color: var(--text-secondary);
                "
              >
                <span
                  ><i class="fas fa-code-branch"></i>
                  {{ repo.branches }} branches</span
                >
                <span
                  ><i class="fas fa-code-commit"></i>
                  {{ repo.commits }} commits</span
                >
                <span><i class="fas fa-tag"></i> {{ repo.tags }} tags</span>
              </div>

              <div class="card-actions">
                <Button variant="primary" @click="openRepo(repo.id)">
                  <i class="fas fa-external-link-alt"></i>
                  Acessar
                </Button>
                <Button variant="outline" @click="deleteRepo(repo.id)">
                  <i class="fas fa-trash-alt"></i>
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>

    <!-- Create Repo Modal -->
    <Modal
      v-model="showCreateModal"
      title="Criar Novo Repositório"
      width="500px"
    >
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
            { label: 'Público', value: 'publico' },
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import HeaderBar from "../components/layout/HeaderBar.vue";
import MetricCard from "../components/common/MetricCard.vue";
import Button from "../components/common/Button.vue";
import Modal from "../components/common/Modal.vue";
import FormField from "../components/common/FormField.vue";
import LoadingSpinner from "../components/common/LoadingSpinner.vue";
import * as RepoService from "../services/RepoService";

const router = useRouter();

const loading = ref(true);
const creating = ref(false);
const stats = ref({
  totalRepos: 0,
  totalCommits: 0,
  totalBranches: 0,
  totalTags: 0,
});
const repositories = ref([]);
const showCreateModal = ref(false);
const newRepo = ref({
  nome: "",
  descricao: "",
  visibilidade: "privado",
});
const errors = ref({});

onMounted(async () => {
  await loadData();
});

const loadData = async () => {
  loading.value = true;
  try {
    const [statsData, reposData] = await Promise.all([
      RepoService.getStats(),
      RepoService.getAll(),
    ]);

    stats.value = statsData;
    repositories.value = reposData.slice(0, 6); // Mostrar apenas 6 mais recentes
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  } finally {
    loading.value = false;
  }
};

const handleCreateRepo = async () => {
  errors.value = {};

  if (!newRepo.value.nome) {
    errors.value.nome = "Nome é obrigatório";
    return;
  }

  creating.value = true;
  try {
    await RepoService.createRepo(newRepo.value);
    showCreateModal.value = false;
    newRepo.value = { nome: "", descricao: "", visibilidade: "privado" };
    await loadData();
  } catch (error) {
    console.error("Erro ao criar repositório:", error);
    errors.value.nome = error.message;
  } finally {
    creating.value = false;
  }
};

const openRepo = (id) => {
  router.push(`/repos/${id}`);
};

const deleteRepo = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este repositório?")) {
    return;
  }

  try {
    await RepoService.deleteRepo(Number(id));
    await loadData();
  } catch (error) {
    console.error("Erro ao deletar repositório:", error);
    alert("Erro ao deletar repositório");
  }
};
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: var(--bg-deep);
}

.hero-section {
  text-align: center;
  margin-bottom: var(--space-12);
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.repo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--space-6);
}

.repo-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  transition: all var(--transition-base);
}

.repo-card:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.repo-card .card-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.repo-card h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-1) 0;
  color: var(--text-primary);
}

.repo-card .card-actions {
  display: flex;
  gap: var(--space-3);
}

@media (max-width: 1024px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .repo-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: var(--font-size-3xl);
  }

  .hero-section p {
    font-size: var(--font-size-base);
  }

  .metrics-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .repo-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .repo-card {
    padding: var(--space-4);
  }

  .repo-card .card-actions {
    flex-direction: column;
  }

  .repo-card .card-actions button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-section {
    margin-bottom: var(--space-8);
  }

  .hero-section h1 {
    font-size: var(--font-size-2xl);
  }

  .metrics-grid {
    gap: var(--space-3);
  }
}
</style>

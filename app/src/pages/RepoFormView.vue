<template>
  <div class="repo-form-container">
    <HeaderBar />
    
    <main class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-8);">
      <LoadingSpinner v-if="loading" message="Carregando repositório..." />
      
      <div v-else class="form-wrapper">
        <!-- Header -->
        <div class="form-header">
          <div>
            <h1>{{ isEditMode ? 'Editar Repositório' : 'Novo Repositório' }}</h1>
            <p>{{ isEditMode ? 'Atualize as informações do repositório' : 'Preencha os dados para criar um novo repositório' }}</p>
          </div>
          <Button variant="outline" @click="handleCancel">
            <i class="fas fa-times"></i>
            Cancelar
          </Button>
        </div>
        
        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="repo-form">
          <div class="form-section">
            <h3>Informações Básicas</h3>
            
            <FormField
              v-model="formData.nome"
              label="Nome do Repositório"
              placeholder="meu-projeto"
              required
              :error="errors.nome"
              help="Use apenas letras minúsculas, números e hífens"
              @blur="validateNome"
            />
            
            <FormField
              v-model="formData.descricao"
              label="Descrição"
              type="textarea"
              placeholder="Descrição detalhada do projeto..."
              :rows="4"
              help="Opcional. Descreva o propósito e funcionalidades do projeto"
            />
          </div>
          
          <div class="form-section">
            <h3>Configurações</h3>
            
            <FormField
              v-model="formData.visibilidade"
              label="Visibilidade"
              type="select"
              required
              :options="[
                { label: 'Privado - Apenas você e colaboradores podem ver', value: 'privado' },
                { label: 'Público - Qualquer pessoa pode ver', value: 'publico' }
              ]"
            />
            
            <FormField
              v-model="formData.tipo"
              label="Tipo de Controle de Versão"
              type="select"
              required
              :options="[
                { label: 'Git', value: 'git' },
                { label: 'SVN', value: 'svn' }
              ]"
              :disabled="isEditMode"
              :help="isEditMode ? 'O tipo não pode ser alterado após a criação' : ''"
            />
          </div>
          
          <div v-if="!isEditMode" class="form-section">
            <h3>Inicialização</h3>
            
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.inicializarComReadme" />
                <span>Adicionar arquivo README.md</span>
              </label>
              <p class="help-text">Recomendado. Cria um arquivo README básico com o nome do projeto</p>
            </div>
            
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.adicionarGitignore" />
                <span>Adicionar .gitignore</span>
              </label>
              <p class="help-text">Adiciona arquivo .gitignore com templates comuns</p>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="form-actions">
            <Button type="button" variant="outline" @click="handleCancel">
              Cancelar
            </Button>
            <Button type="submit" variant="primary" :loading="saving">
              <i :class="isEditMode ? 'fas fa-save' : 'fas fa-plus'"></i>
              {{ isEditMode ? 'Salvar Alterações' : 'Criar Repositório' }}
            </Button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderBar from '../components/layout/HeaderBar.vue';
import Button from '../components/common/Button.vue';
import FormField from '../components/common/FormField.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import * as RepoService from '../services/RepoService';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const errors = ref({});

const formData = ref({
  nome: '',
  descricao: '',
  visibilidade: 'privado',
  tipo: 'git',
  inicializarComReadme: true,
  adicionarGitignore: false
});

const isEditMode = computed(() => !!route.params.id);

onMounted(async () => {
  if (isEditMode.value) {
    await loadRepo();
  }
});

const loadRepo = async () => {
  loading.value = true;
  try {
    const repo = await RepoService.getById(route.params.id);
    if (repo) {
      formData.value = {
        nome: repo.nome,
        descricao: repo.descricao || '',
        visibilidade: repo.visibilidade,
        tipo: repo.tipo,
        inicializarComReadme: false,
        adicionarGitignore: false
      };
    } else {
      alert('Repositório não encontrado');
      router.push('/repos');
    }
  } catch (error) {
    console.error('Erro ao carregar repositório:', error);
    alert('Erro ao carregar repositório');
    router.push('/repos');
  } finally {
    loading.value = false;
  }
};

const validateNome = () => {
  errors.value.nome = '';
  
  if (!formData.value.nome) {
    errors.value.nome = 'Nome é obrigatório';
    return false;
  }
  
  // Validar formato: apenas letras minúsculas, números e hífens
  const regex = /^[a-z0-9-]+$/;
  if (!regex.test(formData.value.nome)) {
    errors.value.nome = 'Use apenas letras minúsculas, números e hífens';
    return false;
  }
  
  // Não pode começar ou terminar com hífen
  if (formData.value.nome.startsWith('-') || formData.value.nome.endsWith('-')) {
    errors.value.nome = 'Não pode começar ou terminar com hífen';
    return false;
  }
  
  return true;
};

const handleSubmit = async () => {
  errors.value = {};
  
  // Validar
  if (!validateNome()) {
    return;
  }
  
  if (!formData.value.visibilidade) {
    errors.value.visibilidade = 'Selecione a visibilidade';
    return;
  }
  
  saving.value = true;
  try {
    if (isEditMode.value) {
      // Editar
      await RepoService.updateRepo(route.params.id, {
        nome: formData.value.nome,
        descricao: formData.value.descricao,
        visibilidade: formData.value.visibilidade
      });
      
      alert('Repositório atualizado com sucesso!');
      router.push(`/repos/${route.params.id}`);
    } else {
      // Criar
      const newRepo = await RepoService.createRepo({
        nome: formData.value.nome,
        descricao: formData.value.descricao,
        visibilidade: formData.value.visibilidade,
        tipo: formData.value.tipo
      });
      
      alert('Repositório criado com sucesso!');
      router.push(`/repos/${newRepo.id}`);
    }
  } catch (error) {
    console.error('Erro ao salvar repositório:', error);
    errors.value.nome = error.message || 'Erro ao salvar repositório';
  } finally {
    saving.value = false;
  }
};

const handleCancel = () => {
  if (confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
    if (isEditMode.value) {
      router.push(`/repos/${route.params.id}`);
    } else {
      router.push('/repos');
    }
  }
};
</script>

<style scoped>
.repo-form-container {
  min-height: 100vh;
  background-color: var(--bg-deep);
}

.form-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
  gap: var(--space-6);
}

.form-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-black);
  margin: 0 0 var(--space-2) 0;
  color: var(--text-primary);
}

.form-header p {
  color: var(--text-secondary);
  margin: 0;
}

.repo-form {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
}

.form-section {
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--border-subtle);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: var(--space-6);
  padding-bottom: 0;
}

.form-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--space-6) 0;
}

.checkbox-group {
  margin-bottom: var(--space-5);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--color-primary-600);
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin: var(--space-2) 0 0 calc(20px + var(--space-3));
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-subtle);
}

@media (max-width: 768px) {
  .form-header {
    flex-direction: column;
  }
  
  .form-header > button {
    width: 100%;
  }
  
  .form-header h1 {
    font-size: var(--font-size-2xl);
  }
  
  .repo-form {
    padding: var(--space-6);
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .form-actions button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .form-header h1 {
    font-size: var(--font-size-xl);
  }
  
  .repo-form {
    padding: var(--space-4);
  }
  
  .form-section h3 {
    font-size: var(--font-size-base);
  }
}
</style>

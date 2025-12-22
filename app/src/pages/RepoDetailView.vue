<template>
  <div class="repo-detail-container">
    <HeaderBar />
    
    <main class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-8);">
      <LoadingSpinner v-if="loading" message="Carregando repositório..." />
      
      <div v-else-if="repo">
        <!-- Header -->
        <div class="repo-header">
          <div>
            <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2);">
              <i class="fas fa-folder-open" style="font-size: 2rem; color: var(--color-warning);"></i>
              <h1 style="margin: 0;">{{ repo.nome }}</h1>
              <span class="badge" :class="repo.visibilidade === 'publico' ? 'badge-success' : 'badge-primary'">
                {{ repo.visibilidade }}
              </span>
            </div>
            <p style="color: var(--text-secondary); margin: 0;">
              {{ repo.descricao || 'Sem descrição' }}
            </p>
            <div style="display: flex; gap: var(--space-6); margin-top: var(--space-4); font-size: var(--font-size-sm); color: var(--text-secondary);">
              <span><i class="fas fa-user"></i> {{ repo.dono }}</span>
              <span><i class="fas fa-calendar"></i> Criado em {{ repo.dataCriacao }}</span>
              <span><i class="fas fa-clock"></i> Último commit: {{ repo.ultimoCommit }}</span>
            </div>
          </div>
          
          <div style="display: flex; gap: var(--space-3);">
            <Button variant="outline" @click="handleClone">
              <i class="fas fa-clone"></i>
              Clonar
            </Button>
            <Button variant="outline" @click="$router.push(`/repos/${repo.id}/editar`)">
              <i class="fas fa-edit"></i>
              Editar
            </Button>
          </div>
        </div>
        
        <!-- Tabs -->
        <TabPanel
          :tabs="[
            { label: 'Arquivos', icon: 'fas fa-folder-tree' },
            { label: 'Commits', icon: 'fas fa-code-commit' },
            { label: 'Branches', icon: 'fas fa-code-branch' },
            { label: 'Tags', icon: 'fas fa-tag' }
          ]"
          @tab-change="handleTabChange"
        >
          <!-- Tab 0: Arquivos -->
          <template #tab-0>
            <div v-if="loadingFiles" style="padding: var(--space-8);">
              <LoadingSpinner message="Carregando arquivos..." />
            </div>
            <div v-else class="files-container">
              <div class="files-toolbar">
                <div class="current-path">
                  <i class="fas fa-folder"></i>
                  <span>{{ currentPath || '/' }}</span>
                </div>
                <div style="display: flex; gap: var(--space-2);">
                  <Button size="sm" variant="primary" @click="showCreateFolderModal = true">
                    <i class="fas fa-folder-plus"></i>
                    Criar Pasta
                  </Button>
                  <Button size="sm" variant="primary" @click="showCreateFileModal = true">
                    <i class="fas fa-file-plus"></i>
                    Criar Arquivo
                  </Button>
                </div>
              </div>
              
              <div class="files-list">
                <div 
                  v-for="file in files" 
                  :key="file.name"
                  class="file-item"
                >
                  <div class="file-info" @click="handleFileClick(file)">
                    <i :class="getFileIcon(file)" :style="{ color: getFileColor(file) }"></i>
                    <span class="file-name">{{ file.name }}</span>
                  </div>
                  <div class="file-meta">
                    <span class="file-date">{{ file.lastModified }}</span>
                    <span class="file-size" v-if="!file.isDirectory">{{ file.size }}</span>
                  </div>
                  <div class="file-actions">
                    <button v-if="!file.isDirectory" class="action-btn action-btn-edit" @click.stop="handleEditFile(file)" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn action-btn-delete" @click.stop="file.isDirectory ? handleDeleteFolder(file) : handleDeleteFile(file)" title="Excluir">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Tab 1: Commits -->
          <template #tab-1>
            <div v-if="loadingCommits" style="padding: var(--space-8);">
              <LoadingSpinner message="Carregando commits..." />
            </div>
            <div v-else-if="commits.length > 0">
              <div v-for="commit in commits" :key="commit.hash" class="commit-item">
                <div class="commit-header">
                  <code class="commit-hash">{{ commit.hash }}</code>
                  <span class="commit-date">{{ commit.data }}</span>
                </div>
                <div class="commit-message">{{ commit.mensagem }}</div>
                <div class="commit-meta">
                  <span><i class="fas fa-user"></i> {{ commit.autor }}</span>
                  <span><i class="fas fa-file"></i> {{ commit.arquivosAlterados }} arquivos alterados</span>
                </div>
                <div class="commit-actions">
                  <Button size="sm" variant="outline" @click="handleRevert(commit.hash)">
                    <i class="fas fa-undo"></i>
                    Reverter
                  </Button>
                </div>
              </div>
            </div>
            <div v-else class="empty-tab">
              <p>Nenhum commit encontrado</p>
            </div>
          </template>
          
          <!-- Tab 2: Branches -->
          <template #tab-2>
            <div style="margin-bottom: var(--space-6);">
              <Button variant="primary" @click="showBranchModal = true">
                <i class="fas fa-plus"></i>
                Criar Branch
              </Button>
            </div>
            
            <div v-if="loadingBranches" style="padding: var(--space-8);">
              <LoadingSpinner message="Carregando branches..." />
            </div>
            <div v-else-if="branches.length > 0" class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Último Commit</th>
                    <th>Autor</th>
                    <th>Hash</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="branch in branches" :key="branch.nome">
                    <td>
                      <strong>{{ branch.nome }}</strong>
                      <span v-if="branch.nome === 'main'" class="badge badge-primary" style="margin-left: var(--space-2);">
                        principal
                      </span>
                    </td>
                    <td>{{ branch.ultimoCommit }}</td>
                    <td>{{ branch.autor }}</td>
                    <td><code>{{ branch.hash }}</code></td>
                    <td>
                      <div style="display: flex; gap: var(--space-2);">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          @click="handleMerge(branch.nome)"
                          :disabled="branch.nome === 'main'"
                        >
                          <i class="fas fa-code-merge"></i>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          @click="handleDeleteBranch(branch.nome)"
                          :disabled="branch.nome === 'main'"
                        >
                          <i class="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-tab">
              <p>Nenhuma branch encontrada</p>
            </div>
          </template>
          
          <!-- Tab 3: Tags -->
          <template #tab-3>
            <div style="margin-bottom: var(--space-6);">
              <Button variant="primary" @click="showTagModal = true">
                <i class="fas fa-plus"></i>
                Criar Tag
              </Button>
            </div>
            
            <div v-if="loadingTags" style="padding: var(--space-8);">
              <LoadingSpinner message="Carregando tags..." />
            </div>
            <div v-else-if="tags.length > 0" class="tags-grid">
              <div v-for="tag in tags" :key="tag.nome" class="tag-card">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div>
                    <h4 style="margin: 0 0 var(--space-2) 0; color: var(--text-primary);">
                      <i class="fas fa-tag" style="color: var(--color-success);"></i>
                      {{ tag.nome }}
                    </h4>
                    <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin: 0;">
                      Commit: <code>{{ tag.commitHash }}</code>
                    </p>
                    <p style="font-size: var(--font-size-sm); color: var(--text-tertiary); margin: var(--space-1) 0 0 0;">
                      {{ tag.autor }} • {{ tag.data }}
                    </p>
                  </div>
                  <Button size="sm" variant="danger" @click="handleDeleteTag(tag.nome)">
                    <i class="fas fa-trash"></i>
                  </Button>
                </div>
              </div>
            </div>
            <div v-else class="empty-tab">
              <p>Nenhuma tag encontrada</p>
            </div>
          </template>
        </TabPanel>
      </div>
      
      <div v-else class="empty-state">
        <i class="fas fa-folder-open" style="font-size: 4rem; color: var(--text-tertiary);"></i>
        <h3>Repositório não encontrado</h3>
        <Button variant="primary" @click="$router.push('/repos')">
          Voltar para Repositórios
        </Button>
      </div>
    </main>
    
    <!-- Create Branch Modal -->
    <Modal v-model="showBranchModal" title="Criar Nova Branch" width="500px">
      <FormField
        v-model="newBranch.nome"
        label="Nome da Branch"
        placeholder="feature/nova-funcionalidade"
        required
        :error="branchErrors.nome"
      />
      
      <template #footer>
        <Button variant="outline" @click="showBranchModal = false">
          Cancelar
        </Button>
        <Button variant="primary" :loading="creatingBranch" @click="handleCreateBranch">
          Criar Branch
        </Button>
      </template>
    </Modal>
    
    <!-- Create Tag Modal -->
    <Modal v-model="showTagModal" title="Criar Nova Tag" width="500px">
      <FormField
        v-model="newTag.nome"
        label="Nome da Tag"
        placeholder="v1.0.0"
        required
        :error="tagErrors.nome"
      />
      
      <FormField
        v-model="newTag.commitHash"
        label="Hash do Commit"
        placeholder="a1b2c3d (deixe vazio para usar HEAD)"
      />
      
      <template #footer>
        <Button variant="outline" @click="showTagModal = false">
          Cancelar
        </Button>
        <Button variant="primary" :loading="creatingTag" @click="handleCreateTag">
          Criar Tag
        </Button>
      </template>
    </Modal>
    
    <!-- Create Folder Modal -->
    <Modal v-model="showCreateFolderModal" title="Criar Nova Pasta" width="500px">
      <FormField
        v-model="newFolder.name"
        label="Nome da Pasta"
        placeholder="nova-pasta"
        required
        :error="folderErrors.name"
      />
      
      <template #footer>
        <Button variant="outline" @click="showCreateFolderModal = false">
          Cancelar
        </Button>
        <Button variant="primary" :loading="creatingFolder" @click="handleCreateFolder">
          Criar Pasta
        </Button>
      </template>
    </Modal>
    
    <!-- Create File Modal -->
    <Modal v-model="showCreateFileModal" title="Criar Novo Arquivo" width="500px">
      <FormField
        v-model="newFile.name"
        label="Nome do Arquivo"
        placeholder="arquivo.js"
        required
        :error="fileErrors.name"
      />
      
      <FormField
        v-model="newFile.content"
        label="Conteúdo Inicial (opcional)"
        placeholder="// Seu código aqui..."
        type="textarea"
        rows="6"
      />
      
      <template #footer>
        <Button variant="outline" @click="showCreateFileModal = false">
          Cancelar
        </Button>
        <Button variant="primary" :loading="creatingFile" @click="handleCreateFile">
          Criar Arquivo
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderBar from '../components/layout/HeaderBar.vue';
import Button from '../components/common/Button.vue';
import TabPanel from '../components/common/TabPanel.vue';
import Modal from '../components/common/Modal.vue';
import FormField from '../components/common/FormField.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';
import * as RepoService from '../services/RepoService';
import * as CommitService from '../services/CommitService';
import * as BranchService from '../services/BranchService';
import * as TagService from '../services/TagService';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const loadingFiles = ref(false);
const loadingCommits = ref(false);
const loadingBranches = ref(false);
const loadingTags = ref(false);
const repo = ref(null);
const files = ref([]);
const currentPath = ref('');
const commits = ref([]);
const branches = ref([]);
const tags = ref([]);

const showBranchModal = ref(false);
const showTagModal = ref(false);
const creatingBranch = ref(false);
const creatingTag = ref(false);

const newBranch = ref({ nome: '' });
const newTag = ref({ nome: '', commitHash: '' });
const branchErrors = ref({});
const tagErrors = ref({});

// Folder and File creation state
const showCreateFolderModal = ref(false);
const showCreateFileModal = ref(false);
const creatingFolder = ref(false);
const creatingFile = ref(false);
const newFolder = ref({ name: '' });
const newFile = ref({ name: '', content: '' });
const folderErrors = ref({});
const fileErrors = ref({});

onMounted(async () => {
  await loadRepo();
  await loadCommits();
});

const loadRepo = async () => {
  loading.value = true;
  try {
    const data = await RepoService.getById(route.params.id);
    repo.value = data;
  } catch (error) {
    console.error('Erro ao carregar repositório:', error);
  } finally {
    loading.value = false;
  }
};

const loadCommits = async () => {
  loadingCommits.value = true;
  try {
    const data = await CommitService.list(route.params.id);
    commits.value = data;
  } catch (error) {
    console.error('Erro ao carregar commits:', error);
  } finally {
    loadingCommits.value = false;
  }
};

const loadBranches = async () => {
  loadingBranches.value = true;
  try {
    const data = await BranchService.list(route.params.id);
    branches.value = data;
  } catch (error) {
    console.error('Erro ao carregar branches:', error);
  } finally {
    loadingBranches.value = false;
  }
};

const loadTags = async () => {
  loadingTags.value = true;
  try {
    const data = await TagService.list(route.params.id);
    tags.value = data;
  } catch (error) {
    console.error('Erro ao carregar tags:', error);
  } finally {
    loadingTags.value = false;
  }
};

const handleTabChange = (index) => {
  if (index === 0 && files.value.length === 0) {
    loadFiles();
  } else if (index === 2 && branches.value.length === 0) {
    loadBranches();
  } else if (index === 3 && tags.value.length === 0) {
    loadTags();
  }
};

const handleClone = async () => {
  try {
    const url = await RepoService.getCloneUrl(route.params.id);
    await navigator.clipboard.writeText(url);
    alert(`URL copiada: ${url}`);
  } catch (error) {
    console.error('Erro ao copiar URL:', error);
  }
};

const handleRevert = async (commitHash) => {
  if (!confirm('Tem certeza que deseja reverter este commit?')) {
    return;
  }
  
  try {
    await CommitService.revert(route.params.id, commitHash);
    await loadCommits();
    alert('Commit revertido com sucesso');
  } catch (error) {
    console.error('Erro ao reverter commit:', error);
    alert('Erro ao reverter commit');
  }
};

const handleCreateBranch = async () => {
  branchErrors.value = {};
  
  if (!newBranch.value.nome) {
    branchErrors.value.nome = 'Nome é obrigatório';
    return;
  }
  
  creatingBranch.value = true;
  try {
    await BranchService.create(route.params.id, newBranch.value.nome);
    showBranchModal.value = false;
    newBranch.value = { nome: '' };
    await loadBranches();
  } catch (error) {
    console.error('Erro ao criar branch:', error);
    branchErrors.value.nome = error.message;
  } finally {
    creatingBranch.value = false;
  }
};

const handleDeleteBranch = async (branchName) => {
  if (!confirm(`Tem certeza que deseja deletar a branch "${branchName}"?`)) {
    return;
  }
  
  try {
    await BranchService.deleteBranch(route.params.id, branchName);
    await loadBranches();
  } catch (error) {
    console.error('Erro ao deletar branch:', error);
    alert(error.message);
  }
};

const handleMerge = async (sourceBranch) => {
  const targetBranch = prompt('Digite o nome da branch de destino:', 'main');
  if (!targetBranch) return;
  
  try {
    const result = await BranchService.merge(route.params.id, sourceBranch, targetBranch);
    if (result.success) {
      alert(result.message);
      await loadBranches();
    } else {
      alert(`${result.message}\nArquivos com conflito:\n${result.conflicts.join('\n')}`);
    }
  } catch (error) {
    console.error('Erro ao fazer merge:', error);
    alert(error.message);
  }
};

const handleCreateTag = async () => {
  tagErrors.value = {};
  
  if (!newTag.value.nome) {
    tagErrors.value.nome = 'Nome é obrigatório';
    return;
  }
  
  creatingTag.value = true;
  try {
    await TagService.create(route.params.id, newTag.value.nome, newTag.value.commitHash);
    showTagModal.value = false;
    newTag.value = { nome: '', commitHash: '' };
    await loadTags();
  } catch (error) {
    console.error('Erro ao criar tag:', error);
    tagErrors.value.nome = error.message;
  } finally {
    creatingTag.value = false;
  }
};

const handleDeleteTag = async (tagName) => {
  if (!confirm(`Tem certeza que deseja deletar a tag "${tagName}"?`)) {
    return;
  }
  
  try {
    await TagService.deleteTag(route.params.id, tagName);
    await loadTags();
  } catch (error) {
    console.error('Erro ao deletar tag:', error);
    alert(error.message);
  }
};

// Funções para gerenciar arquivos
const loadFiles = async () => {
  loadingFiles.value = true;
  try {
    files.value = [
      { name: 'README.md', isDirectory: false, size: '2.5 KB', lastModified: '2024-12-19' },
      { name: 'package.json', isDirectory: false, size: '1.2 KB', lastModified: '2024-12-18' },
      { name: 'src', isDirectory: true, size: '-', lastModified: '2024-12-20' },
      { name: 'public', isDirectory: true, size: '-', lastModified: '2024-12-15' },
      { name: '.gitignore', isDirectory: false, size: '245 B', lastModified: '2024-12-10' },
      { name: 'index.html', isDirectory: false, size: '850 B', lastModified: '2024-12-19' }
    ];
  } finally {
    loadingFiles.value = false;
  }
};

const getFileIcon = (file) => {
  if (file.isDirectory) return 'fas fa-folder';
  const ext = file.name.split('.').pop().toLowerCase();
  const icons = {
    'md': 'fas fa-file-alt', 'js': 'fab fa-js-square', 'json': 'fas fa-file-code',
    'css': 'fab fa-css3-alt', 'html': 'fab fa-html5', 'vue': 'fab fa-vuejs'
  };
  return icons[ext] || 'fas fa-file';
};

const getFileColor = (file) => {
  if (file.isDirectory) return 'var(--color-warning)';
  const ext = file.name.split('.').pop().toLowerCase();
  const colors = {
    'js': 'var(--color-warning)', 'json': 'var(--color-success)',
    'css': 'var(--color-primary-500)', 'vue': 'var(--color-success)'
  };
  return colors[ext] || 'var(--text-secondary)';
};

const handleFileClick = (file) => {
  if (!file.isDirectory) {
    router.push(`/repos/${route.params.id}/arquivo?file=${file.name}`);
  }
};

const handleEditFile = (file) => {
  router.push(`/repos/${route.params.id}/arquivo?file=${file.name}`);
};

const handleDeleteFile = async (file) => {
  if (!confirm(`Tem certeza que deseja excluir o arquivo "${file.name}"?`)) {
    return;
  }
  
  try {
    // Simular exclusão do arquivo
    files.value = files.value.filter(f => f.name !== file.name);
    alert(`Arquivo "${file.name}" excluído com sucesso!`);
  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
    alert('Erro ao excluir arquivo');
  }
};

const handleDeleteFolder = async (folder) => {
  if (!confirm(`Tem certeza que deseja excluir a pasta "${folder.name}"? Esta ação não pode ser desfeita.`)) {
    return;
  }
  
  try {
    // Simular exclusão da pasta
    files.value = files.value.filter(f => f.name !== folder.name);
    alert(`Pasta "${folder.name}" excluída com sucesso!`);
  } catch (error) {
    console.error('Erro ao excluir pasta:', error);
    alert('Erro ao excluir pasta');
  }
};

// Folder creation handler
const handleCreateFolder = async () => {
  folderErrors.value = {};
  
  if (!newFolder.value.name) {
    folderErrors.value.name = 'Nome é obrigatório';
    return;
  }
  
  // Validate folder name (no special characters except dash and underscore)
  if (!/^[a-zA-Z0-9_-]+$/.test(newFolder.value.name)) {
    folderErrors.value.name = 'Nome inválido. Use apenas letras, números, - e _';
    return;
  }
  
  // Check if folder already exists
  if (files.value.some(f => f.name === newFolder.value.name)) {
    folderErrors.value.name = 'Uma pasta ou arquivo com este nome já existe';
    return;
  }
  
  creatingFolder.value = true;
  try {
    // Simulate folder creation
    const newFolderItem = {
      name: newFolder.value.name,
      isDirectory: true,
      size: '-',
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    files.value.push(newFolderItem);
    
    // Sort files: folders first, then alphabetically
    files.value.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    showCreateFolderModal.value = false;
    newFolder.value = { name: '' };
    alert(`Pasta "${newFolderItem.name}" criada com sucesso!`);
  } catch (error) {
    console.error('Erro ao criar pasta:', error);
    folderErrors.value.name = error.message;
  } finally {
    creatingFolder.value = false;
  }
};

// File creation handler
const handleCreateFile = async () => {
  fileErrors.value = {};
  
  if (!newFile.value.name) {
    fileErrors.value.name = 'Nome é obrigatório';
    return;
  }
  
  // Validate file name
  if (!/^[a-zA-Z0-9_.-]+$/.test(newFile.value.name)) {
    fileErrors.value.name = 'Nome inválido. Use apenas letras, números, -, _ e .';
    return;
  }
  
  // Check if file already exists
  if (files.value.some(f => f.name === newFile.value.name)) {
    fileErrors.value.name = 'Um arquivo ou pasta com este nome já existe';
    return;
  }
  
  creatingFile.value = true;
  try {
    // Simulate file creation
    const contentSize = newFile.value.content ? new Blob([newFile.value.content]).size : 0;
    const newFileItem = {
      name: newFile.value.name,
      isDirectory: false,
      size: contentSize > 1024 ? `${(contentSize / 1024).toFixed(1)} KB` : `${contentSize} B`,
      lastModified: new Date().toISOString().split('T')[0]
    };
    
    files.value.push(newFileItem);
    
    // Sort files: folders first, then alphabetically
    files.value.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    
    showCreateFileModal.value = false;
    newFile.value = { name: '', content: '' };
    alert(`Arquivo "${newFileItem.name}" criado com sucesso!`);
  } catch (error) {
    console.error('Erro ao criar arquivo:', error);
    fileErrors.value.name = error.message;
  } finally {
    creatingFile.value = false;
  }
};
</script>

<style scoped>
.repo-detail-container {
  min-height: 100vh;
  background-color: var(--bg-deep);
}

.repo-header {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
}

.commit-item {
  padding: var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
  transition: background-color var(--transition-fast);
}

.commit-item:hover {
  background-color: var(--bg-elevated);
}

.commit-item:last-child {
  border-bottom: none;
}

.commit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-2);
}

.commit-hash {
  background-color: var(--bg-elevated);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--color-primary-400);
}

.commit-date {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.commit-message {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}

.commit-meta {
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}

.commit-actions {
  display: flex;
  gap: var(--space-2);
}

.table-container {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.tags-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}

.tag-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  transition: all var(--transition-base);
}

.tag-card:hover {
  border-color: var(--border-medium);
  box-shadow: var(--shadow-md);
}

/* Files Browser */
.files-container {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.files-toolbar {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  background-color: var(--bg-elevated);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
}

.current-path {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.files-list {
  max-height: 600px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--border-subtle);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.file-item:hover {
  background-color: var(--bg-elevated);
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.file-info i {
  font-size: 1.25rem;
}

.file-name {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.file-meta {
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

.file-actions {
  display: flex;
  gap: var(--space-2);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.875rem;
}

.action-btn:hover {
  background-color: var(--bg-elevated);
  transform: scale(1.1);
}

.action-btn-edit:hover {
  color: var(--color-purple-400);
  background-color: rgba(168, 85, 247, 0.1);
}

.action-btn-delete:hover {
  color: var(--color-error);
  background-color: rgba(239, 68, 68, 0.1);
}

.action-btn:active {
  transform: scale(0.95);
}

.file-info {
  flex: 1;
  cursor: pointer;
}

.empty-tab {
  padding: var(--space-12);
  text-align: center;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-8);
}

.empty-state h3 {
  margin: var(--space-6) 0;
  color: var(--text-primary);
}

@media (max-width: 1024px) {
  .repo-header {
    padding: var(--space-6);
  }
  
  .tags-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .repo-header {
    flex-direction: column;
    padding: var(--space-5);
    gap: var(--space-4);
  }
  
  .repo-header > div:first-child {
    width: 100%;
  }
  
  .repo-header > div:last-child {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .repo-header > div:last-child button {
    width: 100%;
  }
  
  .repo-header h1 {
    font-size: var(--font-size-2xl);
  }
  
  .commit-item {
    padding: var(--space-4);
  }
  
  .commit-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
  }
  
  .commit-meta {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .commit-actions {
    width: 100%;
  }
  
  .commit-actions button {
    width: 100%;
  }
  
  .table-container {
    overflow-x: auto;
    border-radius: var(--radius-md);
  }
  
  .table {
    min-width: 700px;
  }
  
  .table th,
  .table td {
    padding: var(--space-3);
    font-size: var(--font-size-sm);
  }
  
  .tags-grid {
    grid-template-columns: 1fr;
  }
  
  .tag-card {
    padding: var(--space-4);
  }
  
  .empty-state {
    padding: var(--space-12) var(--space-4);
  }
  
  .empty-state h3 {
    font-size: var(--font-size-xl);
  }
}

@media (max-width: 480px) {
  .repo-header {
    padding: var(--space-4);
  }
  
  .repo-header h1 {
    font-size: var(--font-size-xl);
  }
  
  .repo-header p {
    font-size: var(--font-size-sm);
  }
  
  .repo-header > div:first-child > div:last-child {
    flex-direction: column;
    gap: var(--space-2);
    font-size: var(--font-size-xs);
  }
  
  .commit-item {
    padding: var(--space-3);
  }
  
  .commit-hash {
    font-size: var(--font-size-xs);
  }
  
  .commit-message {
    font-size: var(--font-size-sm);
  }
  
  .commit-meta {
    font-size: var(--font-size-xs);
  }
  
  .table th,
  .table td {
    padding: var(--space-2);
    font-size: var(--font-size-xs);
  }
  
  .tag-card {
    padding: var(--space-3);
  }
  
  .tag-card h4 {
    font-size: var(--font-size-base);
  }
  
  .empty-state {
    padding: var(--space-8) var(--space-4);
  }
  
  .empty-state i {
    font-size: 3rem !important;
  }
}
</style>

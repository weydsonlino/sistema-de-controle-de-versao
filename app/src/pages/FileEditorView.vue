<template>
  <div class="file-editor-container">
    <HeaderBar />
    
    <main class="container" style="padding-top: var(--space-8); padding-bottom: var(--space-8);">
      <LoadingSpinner v-if="loading" message="Carregando arquivo..." />
      
      <div v-else class="editor-wrapper">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <router-link :to="`/repos/${repoId}`" class="breadcrumb-item">
            <i class="fas fa-folder"></i>
            {{ repoName }}
          </router-link>
          <span class="separator">/</span>
          <span class="breadcrumb-item active">{{ fileName }}</span>
        </nav>
        
        <!-- File Header -->
        <div class="file-header">
          <div class="file-info">
            <i :class="getFileIcon(fileName)" style="font-size: 1.5rem; color: var(--color-primary-500);"></i>
            <div>
              <h2>{{ fileName }}</h2>
              <p>{{ fileSize }} • Última modificação: {{ lastModified }}</p>
            </div>
          </div>
          
          <div class="file-actions">
            <Button variant="outline" @click="handleCancel">
              <i class="fas fa-times"></i>
              Cancelar
            </Button>
            <Button variant="primary" :loading="saving" @click="handleSave">
              <i class="fas fa-save"></i>
              Salvar
            </Button>
          </div>
        </div>
        
        <!-- Editor -->
        <div class="editor-container">
          <div class="editor-toolbar">
            <div class="toolbar-left">
              <button 
                class="toolbar-btn" 
                :class="{ active: viewMode === 'edit' }"
                @click="viewMode = 'edit'"
              >
                <i class="fas fa-edit"></i>
                Editar
              </button>
              <button 
                class="toolbar-btn" 
                :class="{ active: viewMode === 'preview' }"
                @click="viewMode = 'preview'"
                v-if="isMarkdown"
              >
                <i class="fas fa-eye"></i>
                Visualizar
              </button>
            </div>
            
            <div class="toolbar-right">
              <span class="line-count">{{ lineCount }} linhas</span>
              <span class="char-count">{{ charCount }} caracteres</span>
            </div>
          </div>
          
          <!-- Edit Mode -->
          <div v-show="viewMode === 'edit'" class="editor-area">
            <div class="line-numbers">
              <div v-for="n in lineCount" :key="n" class="line-number">{{ n }}</div>
            </div>
            <textarea
              v-model="fileContent"
              class="code-editor"
              spellcheck="false"
              @input="updateCounts"
              @keydown.tab.prevent="handleTab"
            ></textarea>
          </div>
          
          <!-- Preview Mode (para Markdown) -->
          <div v-show="viewMode === 'preview' && isMarkdown" class="preview-area">
            <div class="markdown-preview" v-html="markdownPreview"></div>
          </div>
        </div>
        
        <!-- Commit Message -->
        <div class="commit-section">
          <h3>Commit das alterações</h3>
          <FormField
            v-model="commitMessage"
            label="Mensagem do commit"
            placeholder="Atualiza arquivo..."
            required
            :error="errors.commitMessage"
          />
          <p class="help-text">
            <i class="fas fa-info-circle"></i>
            Descreva brevemente as alterações feitas neste arquivo
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderBar from '../components/layout/HeaderBar.vue';
import Button from '../components/common/Button.vue';
import FormField from '../components/common/FormField.vue';
import LoadingSpinner from '../components/common/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const saving = ref(false);
const viewMode = ref('edit');
const errors = ref({});

const repoId = ref(route.params.id || '1');
const repoName = ref('projeto-sistema-v1');
const fileName = ref(route.query.file || 'README.md');
const fileContent = ref('');
const commitMessage = ref('');
const lastModified = ref('2024-12-20 10:30');

const lineCount = computed(() => {
  return fileContent.value.split('\n').length;
});

const charCount = computed(() => {
  return fileContent.value.length;
});

const fileSize = computed(() => {
  const bytes = new Blob([fileContent.value]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
});

const isMarkdown = computed(() => {
  return fileName.value.endsWith('.md');
});

const markdownPreview = computed(() => {
  // Simples conversão de Markdown para HTML (em produção, use uma lib como marked.js)
  let html = fileContent.value;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Code inline
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Line breaks
  html = html.replace(/\n/g, '<br>');
  
  return html;
});

onMounted(() => {
  loadFile();
});

const loadFile = () => {
  loading.value = true;
  
  // Simular carregamento de arquivo
  setTimeout(() => {
    // Conteúdo de exemplo baseado no tipo de arquivo
    if (fileName.value.endsWith('.md')) {
      fileContent.value = `# ${repoName.value}

## Descrição
Este é um projeto de sistema de controle de versão.

## Instalação
\`\`\`bash
npm install
\`\`\`

## Uso
\`\`\`bash
npm run dev
\`\`\`

## Contribuindo
Pull requests são bem-vindos!

## Licença
MIT`;
    } else if (fileName.value.endsWith('.js')) {
      fileContent.value = `// ${fileName.value}

export function exemplo() {
  console.log('Hello World');
}

export default {
  nome: '${repoName.value}',
  versao: '1.0.0'
};`;
    } else if (fileName.value.endsWith('.json')) {
      fileContent.value = `{
  "name": "${repoName.value}",
  "version": "1.0.0",
  "description": "Sistema de controle de versão",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}`;
    } else {
      fileContent.value = `Conteúdo do arquivo ${fileName.value}`;
    }
    
    loading.value = false;
  }, 500);
};

const getFileIcon = (filename) => {
  if (filename.endsWith('.md')) return 'fas fa-file-alt';
  if (filename.endsWith('.js')) return 'fab fa-js-square';
  if (filename.endsWith('.json')) return 'fas fa-file-code';
  if (filename.endsWith('.css')) return 'fab fa-css3-alt';
  if (filename.endsWith('.html')) return 'fab fa-html5';
  if (filename.endsWith('.vue')) return 'fab fa-vuejs';
  return 'fas fa-file';
};

const updateCounts = () => {
  // Atualiza contadores automaticamente via computed
};

const handleTab = (event) => {
  const textarea = event.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  // Inserir tab (2 espaços)
  fileContent.value = fileContent.value.substring(0, start) + '  ' + fileContent.value.substring(end);
  
  // Mover cursor
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2;
  }, 0);
};

const handleSave = () => {
  errors.value = {};
  
  if (!commitMessage.value) {
    errors.value.commitMessage = 'Mensagem do commit é obrigatória';
    return;
  }
  
  saving.value = true;
  
  // Simular salvamento
  setTimeout(() => {
    alert(`Arquivo salvo com sucesso!\nCommit: "${commitMessage.value}"`);
    saving.value = false;
    router.push(`/repos/${repoId.value}`);
  }, 1000);
};

const handleCancel = () => {
  if (confirm('Deseja cancelar? As alterações não salvas serão perdidas.')) {
    router.push(`/repos/${repoId.value}`);
  }
};
</script>

<style scoped>
.file-editor-container {
  min-height: 100vh;
  background-color: var(--bg-deep);
}

.editor-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-size: var(--font-size-sm);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-item:hover {
  color: var(--text-primary);
}

.breadcrumb-item.active {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

.separator {
  color: var(--text-tertiary);
}

/* File Header */
.file-header {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-6);
}

.file-info {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
}

.file-info h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-1) 0;
  color: var(--text-primary);
}

.file-info p {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

.file-actions {
  display: flex;
  gap: var(--space-3);
}

/* Editor Container */
.editor-container {
  background-color: var(--bg-surface);
  border-left: 1px solid var(--border-subtle);
  border-right: 1px solid var(--border-subtle);
}

.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
  background-color: var(--bg-elevated);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: var(--space-3);
  align-items: center;
}

.toolbar-btn {
  padding: var(--space-2) var(--space-4);
  background: transparent;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.toolbar-btn:hover {
  background-color: var(--bg-surface);
  color: var(--text-primary);
}

.toolbar-btn.active {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: white;
}

.line-count,
.char-count {
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

/* Editor Area */
.editor-area {
  display: flex;
  min-height: 500px;
  max-height: 70vh;
}

.line-numbers {
  background-color: var(--bg-elevated);
  padding: var(--space-4) var(--space-3);
  border-right: 1px solid var(--border-subtle);
  user-select: none;
  overflow: hidden;
}

.line-number {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  text-align: right;
  line-height: 1.6;
}

.code-editor {
  flex: 1;
  padding: var(--space-4);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--text-primary);
  background-color: var(--bg-surface);
  border: none;
  outline: none;
  resize: none;
  overflow-y: auto;
  tab-size: 2;
}

/* Preview Area */
.preview-area {
  padding: var(--space-6);
  min-height: 500px;
  max-height: 70vh;
  overflow-y: auto;
}

.markdown-preview {
  color: var(--text-primary);
  line-height: 1.8;
}

.markdown-preview h1 {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-4);
}

.markdown-preview h2 {
  font-size: var(--font-size-2xl);
  margin: var(--space-6) 0 var(--space-3) 0;
}

.markdown-preview h3 {
  font-size: var(--font-size-xl);
  margin: var(--space-4) 0 var(--space-2) 0;
}

.markdown-preview code {
  background-color: var(--bg-elevated);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
}

.markdown-preview a {
  color: var(--color-primary-500);
  text-decoration: underline;
}

/* Commit Section */
.commit-section {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  padding: var(--space-6);
  border-top: 2px solid var(--border-medium);
}

.commit-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--space-4) 0;
  color: var(--text-primary);
}

.help-text {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-top: var(--space-2);
}

/* Responsive */
@media (max-width: 768px) {
  .file-header {
    flex-direction: column;
    padding: var(--space-4);
  }
  
  .file-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .file-actions button {
    width: 100%;
  }
  
  .editor-toolbar {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }
  
  .line-numbers {
    display: none;
  }
  
  .code-editor {
    font-size: var(--font-size-xs);
  }
}
</style>

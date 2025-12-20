<template>
  <div class="repo-shell">
    <header class="repo-header">
      <div class="repo-info">
        <i class="fas fa-database"></i>
        <div>
          <h1>{{ repoName || 'Repositório Selecionado' }}</h1>
          <p>Gerencie arquivos, commits e histórico de versões.</p>
        </div>
      </div>
      <div class="repo-actions">
        <button class="btn-primary" @click="novoCommit">
          <i class="fas fa-plus"></i> Novo Commit
        </button>
        <button class="btn-outline" @click="voltarHome">
          <i class="fas fa-arrow-left"></i> Voltar
        </button>
      </div>
    </header>

    <div class="repo-layout">
      <nav class="repo-sidebar">
        <div class="section-title">ARQUIVOS</div>
        <div class="file-tree">
          <div v-for="file in files" :key="file.name" class="file-item" :class="{ active: selectedFile === file }">
            <i :class="file.icon" :style="{ color: file.color }"></i>
            <span @click="selectFile(file)">{{ file.name }}</span>
            <button v-if="file.type === 'file'" class="edit-btn" @click="editFile(file)">
              <i class="fas fa-edit"></i>
            </button>
          </div>
        </div>
      </nav>

      <section class="repo-main">
        <div class="file-viewer">
          <div v-if="!selectedFile" class="no-file">
            <i class="fas fa-file-code"></i>
            <p>Selecione um arquivo para visualizar ou editar.</p>
          </div>
          <div v-else class="file-content">
            <div class="file-header">
              <h3>{{ selectedFile.name }}</h3>
              <div class="file-actions">
                <button class="btn-small" @click="saveFile">Salvar</button>
                <button class="btn-small" @click="commitFile">Commit</button>
              </div>
            </div>
            <textarea v-model="fileContent" class="file-editor" placeholder="Conteúdo do arquivo..."></textarea>
          </div>
        </div>
      </section>

      <aside class="repo-panel">
        <div class="section-title">COMMITS RECENTES</div>
        <div class="commits-list">
          <div v-for="commit in recentCommits" :key="commit.hash" class="commit-item">
            <div class="commit-meta">
              <span class="commit-time">{{ commit.time }}</span>
              <span class="commit-hash">{{ commit.hash.slice(0, 7) }}</span>
            </div>
            <p class="commit-msg">{{ commit.msg }}</p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const repoName = ref('Meu Repositório');
const selectedFile = ref(null);
const fileContent = ref('');

const files = ref([
  { name: 'src/', icon: 'fas fa-folder', color: '#2f81f7', type: 'folder' },
  { name: 'App.vue', icon: 'fas fa-file-code', color: '#238636', type: 'file' },
  { name: 'main.js', icon: 'fas fa-file-code', color: '#238636', type: 'file' },
  { name: 'components/', icon: 'fas fa-folder', color: '#2f81f7', type: 'folder' },
  { name: 'Header.vue', icon: 'fas fa-file-code', color: '#238636', type: 'file' }
]);

const recentCommits = ref([
  { time: '2025-12-20 14:00', msg: 'Update main component', hash: 'abc1234' },
  { time: '2025-12-20 13:00', msg: 'Add new feature', hash: 'def5678' },
  { time: '2025-12-20 12:00', msg: 'Initial setup', hash: 'ghi9012' }
]);

const selectFile = (file) => {
  if (file.type === 'file') {
    selectedFile.value = file;
    fileContent.value = `// Conteúdo de ${file.name}\nconsole.log('Hello World');\n`;
  }
};

const editFile = (file) => {
  selectFile(file);
};

const saveFile = () => {
  alert('Arquivo salvo!');
};

const commitFile = () => {
  alert('Commit realizado!');
};

const novoCommit = () => {
  const msg = prompt("Mensagem do commit:");
  if (msg) {
    const newCommit = {
      time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      msg,
      hash: Math.random().toString(36).substr(2, 8)
    };
    recentCommits.value.unshift(newCommit);
  }
};

const voltarHome = () => {
  router.push('/');
};

onMounted(() => {
  // Simular carregamento do repositório
  console.log('Repositório carregado');
});
</script>

<style scoped>
.repo-shell {
  min-height: 100vh;
  background-color: #0d1117;
  color: #f5f5f5;
  font-family: 'Inter', system-ui, sans-serif;
}

.repo-header {
  height: 80px;
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #262626;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.repo-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.repo-info i {
  font-size: 2rem;
  color: #fbbf24;
}

.repo-info h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.repo-info p {
  color: #a3a3a3;
  margin: 4px 0 0;
  font-size: 0.9rem;
}

.repo-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  background-color: #643bf6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: filter 0.2s;
}

.btn-primary:hover {
  filter: brightness(1.2);
}

.btn-outline {
  background: transparent;
  border: 1px solid #262626;
  color: #f5f5f5;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #f5f5f5;
  color: #0d1117;
}

.repo-layout {
  display: flex;
  flex: 1;
  min-height: calc(100vh - 80px);
}

.repo-sidebar {
  width: 300px;
  background-color: #161b22;
  border-right: 1px solid #262626;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 800;
  color: #8b949e;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 16px;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.file-item:hover {
  background: #21262d;
}

.file-item.active {
  background: #643bf6;
  color: white;
}

.file-item i {
  font-size: 1.2rem;
}

.edit-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #8b949e;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.edit-btn:hover {
  background: #30363d;
  color: #f5f5f5;
}

.repo-main {
  flex: 1;
  padding: 20px;
  background: #0d1117;
}

.file-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.no-file {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #8b949e;
  text-align: center;
}

.no-file i {
  font-size: 3rem;
  margin-bottom: 16px;
}

.file-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #262626;
}

.file-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.btn-small {
  background: #238636;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: filter 0.2s;
}

.btn-small:hover {
  filter: brightness(1.2);
}

.file-editor {
  flex: 1;
  background: #161b22;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #f5f5f5;
  resize: none;
  outline: none;
}

.file-editor:focus {
  border-color: #643bf6;
}

.repo-panel {
  width: 350px;
  background-color: #161b22;
  border-left: 1px solid #262626;
  padding: 20px;
  overflow-y: auto;
}

.commits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.commit-item {
  border-left: 3px solid #643bf6;
  padding-left: 12px;
  position: relative;
}

.commit-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  width: 14px;
  height: 14px;
  background: #0d1117;
  border: 3px solid #643bf6;
  border-radius: 50%;
}

.commit-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #8b949e;
  margin-bottom: 4px;
}

.commit-msg {
  margin: 0;
  font-size: 0.9rem;
  color: #f5f5f5;
}

/* Responsividade */
@media (max-width: 768px) {
  .repo-layout {
    flex-direction: column;
  }

  .repo-sidebar, .repo-panel {
    width: 100%;
    height: auto;
  }

  .repo-header {
    padding: 0 20px;
    height: auto;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .repo-actions {
    align-self: stretch;
    justify-content: space-between;
  }
}
</style>

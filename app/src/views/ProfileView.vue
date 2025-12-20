<template>
  <div class="profile-shell">
    <header class="profile-header">
      <div class="profile-info">
        <i class="fas fa-user-circle"></i>
        <div>
          <h1>{{ user.name }}</h1>
          <p>{{ user.email }}</p>
        </div>
      </div>
      <div class="profile-actions">
        <button class="btn-outline" @click="editProfile">
          <i class="fas fa-edit"></i> Edit Profile
        </button>
        <button class="btn-outline" @click="goBack">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      </div>
    </header>

    <div class="profile-content">
      <section class="profile-section">
        <h2>Personal Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>Full Name</label>
            <p>{{ user.name }}</p>
          </div>
          <div class="info-item">
            <label>Email</label>
            <p>{{ user.email }}</p>
          </div>
          <div class="info-item">
            <label>Username</label>
            <p>{{ user.username }}</p>
          </div>
          <div class="info-item">
            <label>Member Since</label>
            <p>{{ user.joinDate }}</p>
          </div>
        </div>
      </section>

      <section class="profile-section">
        <h2>Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-number">{{ user.stats.repositories }}</div>
            <div class="stat-label">Repositories</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ user.stats.commits }}</div>
            <div class="stat-label">Commits</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ user.stats.contributions }}</div>
            <div class="stat-label">Contributions</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ user.stats.followers }}</div>
            <div class="stat-label">Followers</div>
          </div>
        </div>
      </section>

      <section class="profile-section">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-for="activity in user.recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <p>{{ activity.description }}</p>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import * as UserService from '../services/UserService';
import * as RepoService from '../services/RepoService';
import * as CommitService from '../services/CommitService';

const router = useRouter();

const user = ref({
  name: 'Loading...',
  email: '',
  username: '',
  joinDate: '',
  avatar: '',
  stats: {
    repositories: 0,
    commits: 0,
    contributions: 0,
    followers: 0
  },
  recentActivity: []
});

onMounted(async () => {
  try {
    // Carregar dados do usuário
    const userData = await UserService.getCurrentUser();
    user.value.name = userData.nome;
    user.value.email = userData.email;
    user.value.avatar = userData.avatar;
    user.value.username = userData.email.split('@')[0];
    user.value.joinDate = 'December 2025'; // Mock data

    // Carregar estatísticas
    await loadUserStats();

    // Carregar atividades recentes
    await loadRecentActivity();
  } catch (error) {
    console.error('Erro ao carregar dados do perfil:', error);
  }
});

const loadUserStats = async () => {
  try {
    const repos = await RepoService.getAll();
    const userRepos = repos.filter(repo => repo.dono === user.value.name);

    user.value.stats.repositories = userRepos.length;
    user.value.stats.commits = userRepos.reduce((total, repo) => total + repo.commits, 0);

    // Mock data for contributions and followers
    user.value.stats.contributions = Math.floor(user.value.stats.commits * 0.8);
    user.value.stats.followers = Math.floor(Math.random() * 50) + 10;
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error);
  }
};

const loadRecentActivity = async () => {
  try {
    const repos = await RepoService.getAll();
    const userRepos = repos.filter(repo => repo.dono === user.value.name);

    let allCommits = [];
    for (const repo of userRepos) {
      try {
        const commits = await CommitService.list(repo.id, 5);
        allCommits = allCommits.concat(commits.map(commit => ({
          ...commit,
          repositorio: repo.nome
        })));
      } catch (error) {
        console.error(`Erro ao carregar commits do repo ${repo.id}:`, error);
      }
    }

    // Ordenar por data e pegar os mais recentes
    allCommits.sort((a, b) => new Date(b.data) - new Date(a.data));
    const recentCommits = allCommits.slice(0, 4);

    user.value.recentActivity = recentCommits.map(commit => ({
      id: commit.hash,
      icon: 'fas fa-code-commit',
      description: `Committed "${commit.mensagem}" to ${commit.repositorio}`,
      time: formatTimeAgo(commit.data)
    }));
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);
    // Fallback to mock data
    user.value.recentActivity = [
      {
        id: 1,
        icon: 'fas fa-code-commit',
        description: 'Committed changes to main branch',
        time: '2 hours ago'
      },
      {
        id: 2,
        icon: 'fas fa-plus',
        description: 'Created new repository',
        time: '1 day ago'
      }
    ];
  }
};

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }
};

const editProfile = () => {
  alert('Edit profile functionality would open here');
};

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.profile-shell {
  min-height: 100vh;
  background-color: #0d1117;
  color: #f5f5f5;
  font-family: 'Inter', system-ui, sans-serif;
}

.profile-header {
  height: 80px;
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #262626;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-info i {
  font-size: 3rem;
  color: #643bf6;
}

.profile-info h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.profile-info p {
  color: #a3a3a3;
  margin: 4px 0 0;
  font-size: 0.9rem;
}

.profile-actions {
  display: flex;
  gap: 16px;
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
  gap: 10px;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #f5f5f5;
  color: #0d1117;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 30px;
}

.profile-section {
  margin-bottom: 40px;
}

.profile-section h2 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f5f5f5;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  background: #161b22;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 20px;
}

.info-item label {
  display: block;
  font-size: 0.9rem;
  color: #a3a3a3;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  color: #f5f5f5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: #161b22;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #643bf6;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.9rem;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #161b22;
  border: 1px solid #262626;
  border-radius: 8px;
  padding: 16px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #643bf6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.activity-content p {
  margin: 0 0 4px 0;
  font-weight: 500;
  color: #f5f5f5;
}

.activity-time {
  font-size: 0.8rem;
  color: #a3a3a3;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 0 20px;
  }

  .profile-info h1 {
    font-size: 1.3rem;
  }

  .profile-content {
    padding: 30px 20px;
  }

  .info-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .activity-item {
    padding: 12px;
  }
}
</style>
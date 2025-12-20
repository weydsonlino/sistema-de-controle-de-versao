<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <i class="fas fa-code-branch logo-icon"></i>
        <h1>Sistema de Controle de Versão</h1>
        <p>Faça login para continuar</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <FormField
          v-model="credentials.email"
          label="Email ou Usuário"
          type="text"
          placeholder="seu@email.com"
          required
          :error="errors.email"
          autocomplete="username"
        >
          <template #icon>
            <i class="fas fa-user"></i>
          </template>
        </FormField>
        
        <FormField
          v-model="credentials.password"
          label="Senha"
          type="password"
          placeholder="••••••••"
          required
          :error="errors.password"
          autocomplete="current-password"
        >
          <template #icon>
            <i class="fas fa-lock"></i>
          </template>
        </FormField>
        
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span>Lembrar de mim</span>
          </label>
          <a href="#" class="forgot-password">Esqueceu a senha?</a>
        </div>
        
        <Button 
          type="submit" 
          variant="primary" 
          :loading="loading"
          style="width: 100%; margin-top: var(--space-6);"
        >
          <i class="fas fa-sign-in-alt"></i>
          Entrar
        </Button>
      </form>
      
      <div class="login-footer">
        <p>Não tem uma conta? <a href="#" @click.prevent="handleRegister">Criar conta</a></p>
      </div>
      
      <div class="demo-credentials">
        <p><strong>Credenciais de demonstração:</strong></p>
        <p>Email: <code>joao.silva@email.com</code></p>
        <p>Senha: <code>qualquer senha</code></p>
      </div>
    </div>
    
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/common/Button.vue';
import FormField from '../components/common/FormField.vue';
import * as UserService from '../services/UserService';

const router = useRouter();

const credentials = ref({
  email: '',
  password: ''
});

const rememberMe = ref(false);
const loading = ref(false);
const errors = ref({});

const handleLogin = async () => {
  errors.value = {};
  
  // Validação básica
  if (!credentials.value.email) {
    errors.value.email = 'Email é obrigatório';
    return;
  }
  
  if (!credentials.value.password) {
    errors.value.password = 'Senha é obrigatória';
    return;
  }
  
  loading.value = true;
  
  try {
    // Simular login (em produção, chamaria uma API real)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Salvar dados do usuário no localStorage
    const userData = {
      nome: 'João Silva',
      email: credentials.value.email,
      avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=643bf6&color=fff'
    };
    
    localStorage.setItem('user_data', JSON.stringify(userData));
    
    if (rememberMe.value) {
      localStorage.setItem('remember_me', 'true');
    }
    
    // Redirecionar para dashboard
    router.push('/dashboard');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    errors.value.email = 'Email ou senha inválidos';
  } finally {
    loading.value = false;
  }
};

const handleRegister = () => {
  alert('Funcionalidade de registro será implementada em breve!');
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-deep) 0%, #0a0e1a 100%);
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--color-primary-600) 0%, transparent 70%);
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 500px;
  height: 500px;
  top: -250px;
  left: -250px;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -200px;
  right: -200px;
  animation-delay: -7s;
}

.circle-3 {
  width: 300px;
  height: 300px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.login-card {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  width: 100%;
  max-width: 450px;
  box-shadow: var(--shadow-2xl);
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.logo-icon {
  font-size: 4rem;
  color: var(--color-primary-500);
  margin-bottom: var(--space-4);
  display: inline-block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.login-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-black);
  margin: 0 0 var(--space-2) 0;
  color: var(--text-primary);
  background: linear-gradient(135deg, var(--color-primary-400), var(--color-secondary-400));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header p {
  color: var(--text-secondary);
  margin: 0;
  font-size: var(--font-size-base);
}

.login-form {
  margin-bottom: var(--space-6);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--color-primary-600);
}

.forgot-password {
  color: var(--color-primary-500);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.forgot-password:hover {
  color: var(--color-primary-400);
  text-decoration: underline;
}

.login-footer {
  text-align: center;
  padding-top: var(--space-6);
  border-top: 1px solid var(--border-subtle);
  margin-top: var(--space-6);
}

.login-footer p {
  color: var(--text-secondary);
  margin: 0;
  font-size: var(--font-size-sm);
}

.login-footer a {
  color: var(--color-primary-500);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.login-footer a:hover {
  color: var(--color-primary-400);
  text-decoration: underline;
}

.demo-credentials {
  margin-top: var(--space-6);
  padding: var(--space-4);
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  text-align: center;
}

.demo-credentials p {
  margin: var(--space-1) 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.demo-credentials strong {
  color: var(--text-primary);
}

.demo-credentials code {
  background-color: var(--bg-deep);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  color: var(--color-primary-400);
  font-size: var(--font-size-xs);
}

@media (max-width: 480px) {
  .login-card {
    padding: var(--space-6);
  }
  
  .login-header h1 {
    font-size: var(--font-size-xl);
  }
  
  .logo-icon {
    font-size: 3rem;
  }
  
  .form-options {
    flex-direction: column;
    gap: var(--space-3);
    align-items: flex-start;
  }
}
</style>

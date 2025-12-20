<template>
  <header class="top-bar">
    <div class="logo">
      <i class="fas fa-terminal"></i>
      <div class="brand-text">
        <span class="name">Versions Control</span>
      </div>
    </div>
    
    <div class="actions">
      <button class="btn-primary" @click="$emit('create-repo')" aria-label="Criar novo repositório">
        <i class="fas fa-plus"></i>
        <span>Novo Repositório</span>
      </button>
    </div>
  </header>
</template>

<script setup>
defineEmits(['create-repo']);
</script>

<style scoped>
.top-bar {
  height: 64px;
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

.logo {
  display: flex;
  align-items: center;
  gap: 14px;
}

.logo i {
  font-size: 1.5rem;
  color: #833bf6;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.name {
  font-weight: 800;
  font-size: 1.2rem;
  letter-spacing: -0.025em;
}

.version {
  font-size: 0.65rem;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-primary {
  background-color: #643bf6;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: filter 0.2s;
}

.btn-primary:hover {
  filter: brightness(1.2);
}
</style>
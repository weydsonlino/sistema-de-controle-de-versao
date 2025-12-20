<template>
  <nav class="sidebar">
    <div class="section-title">EXPLORADOR (N-ÁRIA)</div>
    <div class="tree-nav">
      <div v-for="item in fileTree" :key="item.name" class="tree-item" :class="{ sub: item.sub }">
        <i :class="item.icon" :style="{ color: item.color }"></i> {{ item.name }}
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  fileTree: {
    type: Array,
    default: () => [
      { name: 'src/', icon: 'fas fa-folder', color: 'var(--folder-blue)', sub: false },
      { name: 'App.vue', icon: 'fas fa-file-code', color: 'var(--file-green)', sub: true },
      { name: 'main.js', icon: 'fas fa-file-code', color: 'var(--file-green)', sub: true }
    ]
  }
});
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: var(--bg-side);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
}

.section-title {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--text-dim);
  padding: 20px 20px 10px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.tree-nav {
  padding: 10px 20px;
  font-size: 0.85rem;
  color: var(--text-dim);
}

.tree-item {
  padding: 5px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tree-item.sub {
  padding-left: 20px;
}
</style>
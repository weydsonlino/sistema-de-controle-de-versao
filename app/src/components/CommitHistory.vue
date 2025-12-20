<template>
  <aside class="details-panel">
    <div class="section-title">HISTÓRICO (ABB)</div>
    <div class="timeline">
      <div v-for="commit in commits" :key="commit.hash" class="timeline-item">
        <div class="time">{{ commit.time }}</div>
        <div class="commit-msg">{{ commit.msg }}</div>
        <div class="hash">{{ commit.hash }}</div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  commits: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.details-panel {
  width: 350px;
  background-color: var(--bg-side);
  border-left: 1px solid var(--border);
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

.timeline {
  padding: 10px 20px;
  overflow-y: auto;
}

.timeline-item {
  border-left: 2px solid var(--accent);
  padding: 0 0 20px 20px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 0;
  width: 12px;
  height: 12px;
  background: var(--bg-dark);
  border: 2px solid var(--accent);
  border-radius: 50%;
}

.time { font-size: 0.7rem; color: var(--text-dim); font-weight: bold; }
.commit-msg { font-size: 0.9rem; margin: 5px 0; color: #fff; }
.hash { font-family: 'Courier New', monospace; font-size: 0.75rem; color: #58a6ff; }
</style>
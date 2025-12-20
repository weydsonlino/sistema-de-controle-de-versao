<template>
  <section class="canvas-area">
    <div class="canvas-header">
      <span><i class="fas fa-project-diagram"></i> Visualização da Infraestrutura</span>
    </div>
    <canvas id="treeCanvas" ref="treeCanvas"></canvas>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const treeCanvas = ref(null);

onMounted(() => {
  if (treeCanvas.value) {
    const ctx = treeCanvas.value.getContext('2d');
    // Desenhar algo básico, ex.: um nó
    ctx.fillStyle = '#2f81f7';
    ctx.fillRect(50, 50, 100, 50);
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText('Root Node', 60, 75);
  }
});
</script>

<style scoped>
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-image:
    radial-gradient(circle, #1c2128 1px, transparent 1px);
  background-size: 30px 30px;
  position: relative;
}

.canvas-header {
  padding: 12px 20px;
  background: rgba(13, 17, 23, 0.7);
  backdrop-filter: blur(8px);
  font-size: 0.8rem;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 10px;
}

#treeCanvas {
  flex: 1;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}
</style>
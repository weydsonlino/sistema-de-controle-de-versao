<template>
  <nav class="pagination">
    <button
      class="pagination-item"
      :disabled="currentPage === 1"
      @click="goToPage(currentPage - 1)"
      aria-label="Página anterior"
    >
      <i class="fas fa-chevron-left"></i>
    </button>
    
    <button
      v-for="page in visiblePages"
      :key="page"
      class="pagination-item"
      :class="{ active: page === currentPage }"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>
    
    <button
      class="pagination-item"
      :disabled="currentPage === totalPages"
      @click="goToPage(currentPage + 1)"
      aria-label="Próxima página"
    >
      <i class="fas fa-chevron-right"></i>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisible: {
    type: Number,
    default: 5
  }
});

const emit = defineEmits(['update:currentPage']);

const visiblePages = computed(() => {
  const pages = [];
  const half = Math.floor(props.maxVisible / 2);
  
  let start = Math.max(1, props.currentPage - half);
  let end = Math.min(props.totalPages, start + props.maxVisible - 1);
  
  // Ajustar início se estiver no final
  if (end - start + 1 < props.maxVisible) {
    start = Math.max(1, end - props.maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page);
  }
};
</script>

<template>
  <div class="loading-container" :style="containerStyle">
    <div :class="spinnerClasses"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: true
  }
});

const spinnerClasses = computed(() => {
  const classes = ['spinner'];
  if (props.size === 'sm') {
    classes.push('spinner-sm');
  }
  return classes.join(' ');
});

const containerStyle = computed(() => {
  if (props.centered) {
    return {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-4)',
      minHeight: '200px'
    };
  }
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)'
  };
});
</script>

<style scoped>
.loading-message {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  margin: 0;
}
</style>

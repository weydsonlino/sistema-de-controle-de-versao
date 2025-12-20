<template>
  <div class="card">
    <div class="card-body">
      <div style="display: flex; align-items: center; gap: var(--space-4);">
        <div 
          :style="{ 
            fontSize: '2.5rem', 
            color: iconColor 
          }"
        >
          <i :class="icon"></i>
        </div>
        <div style="flex: 1;">
          <div style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-1);">
            {{ label }}
          </div>
          <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--text-primary);">
            {{ value }}
          </div>
          <div v-if="subtitle" style="font-size: var(--font-size-xs); color: var(--text-tertiary); margin-top: var(--space-1);">
            {{ subtitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    default: 'var(--color-primary-500)'
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

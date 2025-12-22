<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="spinner spinner-sm"></span>
    <i v-if="icon && !loading" :class="icon"></i>
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'danger', 'purple', 'success'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const buttonClasses = computed(() => {
  const classes = ['btn'];
  
  // Variant
  classes.push(`btn-${props.variant}`);
  
  // Size
  if (props.size !== 'md') {
    classes.push(`btn-${props.size}`);
  }
  
  return classes.join(' ');
});

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

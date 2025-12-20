<template>
  <div class="form-group">
    <label v-if="label" :for="id" class="form-label">
      {{ label }}
      <span v-if="required" style="color: var(--color-error);">*</span>
    </label>
    
    <input
      v-if="type !== 'textarea' && type !== 'select'"
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      class="input-field"
      :class="{ 'error': error }"
      @input="handleInput"
      @blur="handleBlur"
    />
    
    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :rows="rows"
      class="input-field"
      :class="{ 'error': error }"
      @input="handleInput"
      @blur="handleBlur"
    ></textarea>
    
    <select
      v-else-if="type === 'select'"
      :id="id"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      class="input-field"
      :class="{ 'error': error }"
      @change="handleInput"
      @blur="handleBlur"
    >
      <option value="" disabled>{{ placeholder || 'Selecione...' }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    
    <div v-if="error" class="form-error">
      {{ error }}
    </div>
    
    <div v-else-if="help" class="form-help">
      {{ help }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  help: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  },
  options: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:modelValue', 'blur']);

const id = computed(() => {
  return `field-${Math.random().toString(36).substring(7)}`;
});

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
};

const handleBlur = (event) => {
  emit('blur', event.target.value);
};
</script>

<style scoped>
.input-field.error {
  border-color: var(--color-error);
}

.input-field.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>

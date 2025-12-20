<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
        <div class="modal" :style="{ width: width }">
          <div class="modal-header">
            <h3 class="modal-title">{{ title }}</h3>
            <button class="modal-close" @click="handleClose" aria-label="Fechar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '600px'
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const handleClose = () => {
  if (props.closeOnOverlay) {
    emit('update:modelValue', false);
    emit('close');
  }
};

// Prevenir scroll quando modal está aberto
import { watch } from 'vue';

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.modal-transition-enter-active,
.modal-transition-leave-active {
  transition: opacity var(--transition-base);
}

.modal-transition-enter-from,
.modal-transition-leave-to {
  opacity: 0;
}

.modal-transition-enter-active .modal,
.modal-transition-leave-active .modal {
  transition: transform var(--transition-slow);
}

.modal-transition-enter-from .modal,
.modal-transition-leave-to .modal {
  transform: translateY(-20px);
}
</style>

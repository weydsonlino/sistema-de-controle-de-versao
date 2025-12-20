<template>
  <div>
    <div class="tabs">
      <div class="tabs-list">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          class="tab"
          :class="{ active: activeTab === index }"
          @click="selectTab(index)"
        >
          <i v-if="tab.icon" :class="tab.icon" style="margin-right: var(--space-2);"></i>
          {{ tab.label }}
        </button>
      </div>
    </div>
    
    <div class="tab-panel">
      <slot :name="`tab-${activeTab}`" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    validator: (tabs) => tabs.every(tab => tab.label)
  },
  defaultTab: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['tab-change']);

const activeTab = ref(props.defaultTab);

const selectTab = (index) => {
  activeTab.value = index;
  emit('tab-change', index);
};
</script>

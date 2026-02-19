<template>
  <div class="form-group-row mb-2">
    <div class="custom-control custom-switch">
      <input
        :id="id"
        type="checkbox"
        class="custom-control-input"
        :checked="modelValue"
        v-bind="attrs"
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <label
        :for="id"
        class="custom-control-label text-gray-900 dark:text-gray-200"
      >
        <slot>
          <!-- По умолчанию, если слот не передан, ничего не показываем -->
          {{ defaultLabel }}
        </slot>
      </label>
    </div>
  </div>
</template>

<script setup>
import { useAttrs } from "vue";

const attrs = useAttrs();

defineProps({
  id: { type: String, required: true },
  modelValue: { type: Boolean, default: false },
  defaultLabel: { type: String, default: "" }, // если слот не передан
});

defineEmits(["update:modelValue"]);
</script>

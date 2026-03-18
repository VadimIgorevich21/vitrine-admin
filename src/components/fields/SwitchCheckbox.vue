<template>
  <div
    class="flex items-center gap-3 mb-4 group cursor-pointer"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div
      class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      :class="modelValue ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      />
    </div>
    <label
      class="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
    >
      <slot>{{ defaultLabel }}</slot>
    </label>
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

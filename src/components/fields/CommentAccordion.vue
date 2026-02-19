<template>
  <toggle-accordion-component
    :is-default-opened="!!modelValue"
    :is-title-only-open="true"
  >
    <template #header-title>
      <span class="text-blue-600">
        <Icon class="inline-block" icon="ic:outline-comment-bank" />
        {{ props.label }}
      </span>
    </template>

    <template #header-additional-info>
      <span class="tooltip-container">
        <span
          v-tooltip2="props.headerAdditionalInfo"
          class="cursor-pointer text-blue-600"
        >
          <span class="fe fe-info"></span>
        </span>
      </span>
    </template>

    <template #header-close>
      <span
        class="text-blue-600"
        :class="{ 'cursor-default': props.disabled }"
        @click.prevent="clearComment"
        >Отменить</span
      >
    </template>

    <template #content>
      <textarea
        v-model="localValue"
        class="form-control disabled:bg-gray-300 disabled:dark:bg-gray-500 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
        :disabled="props.disabled ?? false"
        :class="{ 'is-invalid': !!error }"
        rows="2"
      />
    </template>
  </toggle-accordion-component>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import ToggleAccordionComponent from "@/components/ToggleAccordionComponent.vue";
import { Icon } from "@iconify/vue/dist/iconify";

interface Props {
  modelValue: string | null;
  label: string | null;
  disabled: boolean | undefined | null;
  headerAdditionalInfo: string | null;
  error?: string | boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    if (val !== localValue.value) localValue.value = val;
  }
);

watch(localValue, (val) => {
  emit("update:modelValue", val);
});

const clearComment = (e) => {
  if (props.disabled) {
    e.stopPropagation();
    return;
  }
  localValue.value = null;
  emit("update:modelValue", null);
};

const error = props.error;
</script>

<template>
  <div
    class="relative flex items-stretch w-full group shadow-sm rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-all focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500"
  >
    <input
      v-model="amount"
      :type="'text'"
      class="flex-grow bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 text-sm outline-none border-none placeholder:text-slate-400"
      :class="{ 'text-red-500': errors?.amount }"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      step="0.001"
      @input="onChange"
    />
    <div
      v-if="text"
      class="flex items-center px-4 bg-slate-50 dark:bg-slate-700/50 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      @click="emitButtonClick"
    >
      <span
        class="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    label: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Number,
      default: null,
    },
    min: {
      type: Number,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    errors: {
      type: Object,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    isNumber: {
      type: Boolean,
      default: false,
    },
    numSymbolsToFloat: {
      type: Number,
      default: 5,
    },
  },
  emits: ["update:modelValue", "button-clicked"],
  setup(props, { emit }) {
    const amount = ref("");
    const oldAmount = ref("");

    const onChange = () => {
      let isValid = false;
      if (props.min >= 0) {
        if (amount.value.length === 0) {
          isValid = true;
        } else {
          if (/^\d+$/.test(amount.value)) {
            isValid = true;
          } else if (/^\d+[,.]$/.test(amount.value)) {
            isValid = true;
          } else if (/^\d+([,.]\d+)?$/.test(amount.value)) {
            isValid = true;
          }
        }
      } else {
        if (amount.value.length === 0) {
          isValid = true;
        } else if (amount.value.length === 1 && amount.value[0] === "-") {
          isValid = true;
        } else if (/^-\d+$/.test(amount.value)) {
          isValid = true;
        } else if (/^-\d+[,.]$/.test(amount.value)) {
          isValid = true;
        } else if (/^-\d+([,.]\d+)?$/.test(amount.value)) {
          isValid = true;
        }
      }

      amount.value = amount.value.replace(",", ".");

      if (amount.value.indexOf(".") != "-1") {
        amount.value = amount.value
          .toString()
          .substring(
            0,
            amount.value.toString().indexOf(".") + props.numSymbolsToFloat
          );
      }

      if (amount.value.indexOf(",") != "-1") {
        amount.value = amount.value
          .toString()
          .substring(
            0,
            amount.value.toString().indexOf(",") + props.numSymbolsToFloat
          );
      }

      if (isValid) {
        emit("update:modelValue", parseFloat(amount.value));
        oldAmount.value = amount.value;
      } else {
        amount.value = oldAmount.value;
      }
    };

    const emitButtonClick = () => {
      emit("button-clicked"); // Эмит события, чтобы родительский компонент мог обработать
    };

    watch(
      () => props.modelValue,
      (value) => {
        if (isNaN(value)) {
          amount.value = "";
          oldAmount.value = amount.value;
        } else if (value === null) {
          amount.value = "";
          oldAmount.value = amount.value;
        } else {
          amount.value = value.toString();
          oldAmount.value = amount.value;
        }
      },
      {
        immediate: true,
      }
    );

    return {
      amount,
      oldAmount,
      onChange,
      emitButtonClick,
    };
  },
};
</script>

<style scoped></style>

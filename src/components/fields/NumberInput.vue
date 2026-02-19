<template>
  <div class="input-group">
    <input
      v-model="amount"
      :type="'text'"
      class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
      :class="{ 'is-invalid': errors?.amount }"
      :disabled="disabled"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      step="0.001"
      @input="onChange"
    />
    <div
      v-if="text"
      class="input-group-append cursor-pointer"
      @click="emitButtonClick"
    >
      <span
        class="input-group-text bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-300"
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

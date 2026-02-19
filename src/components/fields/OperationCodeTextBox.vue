<template>
  <div class="col-lg-6">
    <input
      v-model="operationCode"
      class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
      required
      :disabled="disabled"
      :class="{ 'is-invalid': errors.operation_code }"
    />
    <has-error :message="errors.operation_code" />
  </div>
</template>

<script>
import HasError from "../HasError.vue";

export default {
  name: "OperationCodeTextBox",
  components: {
    HasError,
  },
  props: {
    errors: {
      type: [Array, Object],
      default: null,
    },
    shortName: {
      type: String,
      default: null,
    },
    code: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  data: () => ({
    operationCode: "",
  }),
  watch: {
    operationCode(value) {
      this.$emit("update", "" + value);
    },
    code: {
      handler(value) {
        this.operationCode = value;
      },
      immediate: true,
    },
  },
};
</script>

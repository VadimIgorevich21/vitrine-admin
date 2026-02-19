<template>
  <select
    v-model="selectedType"
    :disabled="disabled"
    class="custom-select customer-type-select custom-select-sm dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400 disabled:bg-gray-300 disabled:dark:bg-gray-500"
    @update:model-value="onChangeSelectedType"
  >
    <option value="" />
    <option
      v-for="type in customerTypes ?? types"
      :key="'type-' + type.key"
      :value="type.key"
    >
      {{ type.label }}
    </option>
  </select>
</template>

<script>
import { syncConfigs } from "../../stores/syncConfigs";

export default {
  props: {
    customerTypes: {
      type: Array,
      default: null,
    },
    modelValue: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    typeOfCustomers: {
      type: String,
      default: "types",
    },
  },
  emits: ["input", "update:modelValue"],

  data: () => ({
    selectedType: null,
    types: [],
  }),

  watch: {
    modelValue: {
      immediate: true,
      handler: function (value) {
        this.selectedType = value;
      },
    },
  },

  created() {
    const configStore2 = syncConfigs();
    const customers = configStore2.customers;
    this.types = customers[this.typeOfCustomers];
  },

  methods: {
    onChangeSelectedType(type) {
      this.$emit("update:modelValue", type);
    },
  },
};
</script>

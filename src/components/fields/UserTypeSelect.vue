<template>
  <select
    v-model="selectedType"
    :disabled="disabled"
    class="custom-select customer-type-select custom-select-sm dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400"
  >
    <option value="" />
    <option v-for="type in types" :key="'type-' + type.key" :value="type.key">
      {{ type.label }}
    </option>
  </select>
</template>

<script>
import { syncConfigs } from "../../stores/syncConfigs";

export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["input"],

  data: () => ({
    selectedType: null,
    types: [],
  }),

  watch: {
    value: {
      immediate: true,
      handler: function (value) {
        this.selectedType = value;
      },
    },

    async selectedType(type) {
      this.$emit("input", type);
    },
  },

  created() {
    const configStore2 = syncConfigs();
    const users = configStore2.users;
    this.types = users[this.roles];
  },
};
</script>

<template>
  <select
    v-model="selectedType"
    class="custom-select customer-type-select custom-select-sm dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400"
  >
    <option v-for="type in types" :key="'type-' + type.key" :value="type.key">
      {{ type.label }}
    </option>
  </select>
</template>

<script>
import { syncConfigs } from "../../../stores/syncConfigs";

export default {
  name: "ContactTypesSelect",
  props: {
    value: {
      type: String,
      default: "phone",
    },
  },
  emits: ["input"],

  setup() {
    const configStore2 = syncConfigs();
    const contacts = configStore2.contacts;
    return { types: contacts.types };
  },

  data: () => ({
    selectedType: null,
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
};
</script>

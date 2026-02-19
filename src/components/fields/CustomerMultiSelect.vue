<template>
  <div class="form-group row">
    <label
      class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
    >
      {{ label }}
    </label>
    <div class="col-lg-6">
      <multiselect
        v-if="!loading"
        v-model="issetCustomers"
        :options="availableCustomers"
        :multiple="true"
        :placeholder="placeholder"
        label="name"
        track-by="id"
      ></multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import CustomerService from "@/services/CustomerService";

export default {
  components: {
    Multiselect,
  },
  props: {
    type: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: "Балансы",
    },
    placeholder: {
      type: String,
      default: "Добавьте баланс",
    },
  },
  emits: ["customersSelected"],
  data: () => ({
    loading: false,
    isShow: false,
    availableCustomers: [],
    selectedCustomers: [],
    issetCustomers: [],
  }),
  watch: {
    issetCustomers() {
      this.$emit("customersSelected", this.issetCustomers);
    },
  },
  async created() {
    await this.getCustomers();
  },
  methods: {
    async getCustomers() {
      try {
        const response = await CustomerService.getCustomers({
          params: {
            page: "-1",
            type: this.type,
            includes: ["empty"],
          },
        });
        this.availableCustomers = response.data.data;
      } catch (e) {
        if (e.response) {
          if (e.response.status === 404) {
            this.availableCustomers = null;
          }
        }
      }
    },
  },
};
</script>

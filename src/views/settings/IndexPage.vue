<template>
  <wrapper-component>
    <template #title> Настройки </template>
    <grid-component
      :items="settings"
      resource-url="settings"
      :headers="headers"
      :loading="loading"
      :per-page="meta?.per_page ?? 0"
      :items-total="meta?.total ?? 0"
      :message-for-empty-table="'Записей не найдено.'"
    >
    </grid-component>
  </wrapper-component>
</template>

<script>
import WrapperComponent from "@/components/WrapperComponent.vue";
import GridComponent from "@/components/GridComponent.vue";
import * as API from "@/services/API";
import { identity, pickBy } from "lodash";

export default {
  components: {
    WrapperComponent,
    GridComponent,
  },
  data: () => ({
    settings: [],
    headers: [
      { text: "#", value: "id" },
      { text: "Название", value: "label" },
      { text: "Значение", value: "value" },
      { text: "Изменен", value: "updated_at" },
    ],
    loading: false,
    meta: null,
  }),
  computed: {
    currentPage() {
      return this.$route.query.page || 1;
    },
  },
  watch: {
    currentPage: function () {
      this.getDeviceRequests();
    },
  },
  async created() {
    this.getDeviceRequests();
  },
  methods: {
    async getDeviceRequests() {
      this.loading = true;
      const response = await API.apiClient.get("/settings", {
        params: pickBy(
          {
            page: this.currentPage,
          },
          identity
        ),
      });

      this.settings = response.data.data;

      this.loading = false;
    },
  },
};
</script>

<template>
  <wrapper-component>
    <template #title>GPT Запросы</template>
    <template #subtitle>{{ title }}</template>
    <template #header-elements>
      <button class="btn btn-white" @click="$router.back()">Вернуться</button>
    </template>

    <div
      v-if="resource"
      class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border shadow"
    >
      <div class="wrapping-table">
        <perfect-scrollbar>
          <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400 lg:overflow-auto overflow-x-scroll"
          >
            <tbody>
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td class="w-1/3 px-1 py-1 md:px-6 md:py-4 text-right">ID</td>
                <td class="px-1 py-1 md:px-6 md:py-4">{{ resource.id }}</td>
              </tr>

              <tr
                v-for="(label, key) in displayFields"
                :key="key"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td class="w-1/3 px-1 py-1 md:px-6 md:py-4 text-right">
                  {{ label }}
                </td>
                <template
                  v-if="key === 'context' && Array.isArray(resource[key])"
                >
                  <div v-for="(msg, idx) in resource[key]" :key="idx">
                    {{ msg }}
                  </div>
                </template>
                <!-- Все остальные поля -->
                <template v-else>
                  {{ resource[key] ?? "—" }}
                </template>
              </tr>

              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td class="px-1 py-1 md:px-6 md:py-4 text-right">Дата</td>
                <td class="px-1 py-1 md:px-6 md:py-4">
                  {{ $filters.formatDate(resource.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </perfect-scrollbar>
      </div>
    </div>

    <loading-component v-else />
  </wrapper-component>
</template>
<script>
import * as API from "@/services/API";
import WrapperComponent from "../../components/WrapperComponent.vue";
import LoadingComponent from "../../components/LoadingComponent.vue";

export default {
  components: {
    WrapperComponent,
    LoadingComponent,
  },
  data: () => ({
    loading: false,
    resource: null,
    displayFields: {
      order_id: "Order ID",
      order_name: "Название заказа",
      counterparty: "Контрагент",
      amount: "Сумма",
      deposit_currency: "Валюта депозита",
      deposit_city: "Город депозита",
      deposit_country: "Страна депозита",
      usd_color: "Цвет USD",
      context: "Контекст",
    },
  }),
  computed: {
    title() {
      return this.resource ? this.resource.id : "...";
    },
  },
  async created() {
    await this.getResource();
  },
  methods: {
    getResource() {
      this.loading = true;

      this.$nextTick(async () => {
        const response = await API.apiClient.get(
          "/gpt-requests/" + this.$route.params.id
        );
        this.resource = response.data.data;
        this.loading = false;
      });
    },
  },
};
</script>

<template>
  <wrapper-component>
    <template #title> Заказы </template>
    <grid-component
      :items="orders"
      :headers="headers"
      :loading="loading"
      :message-for-empty-table="'Заказов не найдено.'"
      :resource-url="'orders'"
      @sorted="sortOrders"
    >
      <template #header>
        <div class="card-header h-auto pb-3">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="input-group input-group-merge input-group-sm">
                <!-- Input -->
                <input
                  ref="searchInput"
                  v-model="searchText"
                  type="search"
                  class="form-control form-control-prepended list-search dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400 focus:border-blue-500 dark:focus:border-blue-500"
                  placeholder="Поиск"
                  @keyup.enter="applySearch"
                  @input="onEmptySearchInput"
                />

                <!-- Prepend -->
                <div class="input-group-prepend">
                  <div
                    class="input-group-text bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-300 focus:border-blue-500"
                  >
                    <span class="fe fe-search" />
                  </div>
                </div>
                <!-- 🔹 Кнопка справа -->
                <div class="input-group-append">
                  <button
                    class="px-2 bg-blue-500 text-white cursor-pointer"
                    @click="applySearch"
                  >
                    Поиск
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #item-created_at="{ item }">
        {{ $filters.formatDateTime(item.created_at) }}
      </template>
      <template #item-status="{ item }">
        <StatusAttribute :order="item"></StatusAttribute>
      </template>
      <template #item-actions="{ item }">
        <dropdown-dots-component>
          <template #dropdown-items>
            <router-link
              v-if="item.actions && item.actions.includes('update')"
              :to="{
                name: 'orders.edit',
                params: { id: item.id },
              }"
              class="dropdown-dots-item"
            >
              <i class="fe fe-edit-2 mr-2" /> Редактировать
            </router-link>
          </template>
        </dropdown-dots-component>
      </template>
    </grid-component>
  </wrapper-component>
</template>

<script>
import * as API from "@/services/API";
import WrapperComponent from "@/components/WrapperComponent.vue";
import GridComponent from "@/components/GridComponent.vue";
import { identity, pickBy } from "lodash";
// import moment from "moment-timezone";
// moment.tz.setDefault("Europe/Kiev");
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import moment from "moment-timezone";
import DropdownDotsComponent from "@/components/DropdownDotsComponent.vue";
import StatusAttribute from "@/views/orders/partial/StatusAttribute.vue";

export default {
  components: {
    StatusAttribute,
    DropdownDotsComponent,
    WrapperComponent,
    GridComponent,
  },
  data: () => ({
    loading: false,
    meta: null,
    searchText: null,
    orders: [],

    headers: [
      { text: "#", value: "id" },
      {
        text: "Клиент",
        value: "user_id",
      },
      { text: "Статус", value: "status" },
      { text: "Дата", value: "created_at" },
      { text: "", value: "actions", width: "1%" },
    ],

    sortedColumn: null,
    direction: null,
  }),
  computed: {
    currentPage() {
      return this.$route.query.page || 1;
    },
  },
  watch: {
    // "$route.query.type": function () {
    //   this.getOperations();
    // },
    // currentPage: function () {
    //   this.getCryptoCurrencyStatistics();
    // },

    "$route.query": {
      async handler() {
        await this.getCryptoCurrencyStatistics();
      },
    },

    // period() {
    //   this.getCryptoCurrencyStatistics();
    // },
    async period() {
      if (!this.period) {
        this.pushQueryParams({
          date_from: null,
          date_to: null,
          page: 1,
        });

        await this.getOrders();
        return;
      }
      const newFrom = this.period
        ? moment(this.period[0]).format("YYYY-MM-DD")
        : null;
      const newTo = this.period
        ? moment(this.period[1]).format("YYYY-MM-DD")
        : null;

      if (
        this.$route.query.date_from === newFrom &&
        this.$route.query.date_to === newTo
      ) {
        return;
      }

      this.pushQueryParams({
        date_from: newFrom,
        date_to: newTo,
        page: 1,
      });

      await this.getOrders();
    },
  },
  async created() {
    this.searchText = this.$route.query.search ?? null;

    const { date_from, date_to } = this.$route.query;

    const isValidDate = (d) => d && moment(d, "YYYY-MM-DD", true).isValid();

    this.period = [
      isValidDate(date_from) ? date_from : moment().format("YYYY-MM-01"),

      isValidDate(date_to) ? date_to : moment().format("YYYY-MM-DD"),
    ];
    await this.getOrders();
  },
  methods: {
    async getOrders() {
      this.loading = true;
      const response = await API.apiClient.get("/orders", {
        params: pickBy(
          {
            query: this.searchText,

            date_from: this.period?.[0]
              ? moment(this.period[0]).format("YYYY-MM-DD")
              : this.$route.query.date_from ?? null,

            date_to: this.period?.[1]
              ? moment(this.period[1]).format("YYYY-MM-DD")
              : this.$route.query.date_to ?? null,
            sortedColumn: this.sortedColumn,
            direction: this.direction,
            page: this.currentPage,
          },
          identity
        ),
      });

      // this.statisticsTransferByDayReports = response.data.data;
      this.orders = response.data.data;
      this.meta = response.data.meta;

      this.loading = false;
    },
    sortOrders(sortedColumn, direction) {
      this.sortedColumn = sortedColumn;
      this.direction = direction;
      this.getOrders();
    },
    pushQueryParams(query) {
      this.$router.push({
        query: pickBy(
          {
            ...this.$route.query,
            ...query,
          },
          identity
        ),
      });
    },
    async applySearch() {
      const value = this.searchText?.trim() || null;

      this.pushQueryParams({
        search: value,
        page: 1,
      });
      // await this.getOperations();
    },
    async onEmptySearchInput() {
      if (!this.searchText) {
        this.pushQueryParams({
          search: null,
          page: 1,
        });
      }
    },
    cancelOrder(order) {
      alert("cancel order");
      console.log("cancel order " + order);
    },
  },
};
</script>

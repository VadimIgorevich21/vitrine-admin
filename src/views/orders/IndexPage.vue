<template>
  <wrapper-component>
    <template #title> Заказы </template>
    <grid-component
      :items="orders"
      :headers="headers"
      :loading="loading"
      :message-for-empty-table="'Заказов не найдено.'"
      :resource-url="'orders'"
      :per-page="meta?.per_page"
      :items-total="meta?.total"
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
            <div class="col-lg-6">
              <datepicker
                v-model="period"
                timezone="Europe/Kiev"
                auto-apply
                format="dd.MM.yyyy"
                class="dark:dp__theme_dark"
                range
                :input-props="{
                  class: 'form-control form-control-sm',
                  placeholder: 'дд.мм.гггг - дд.мм.гггг',
                }"
              />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6 mt-2 select-min-height-40">
            <reworked-multiselect
              v-model="userFilter"
              :options="users"
              placeholder="Пользователь"
              label="name"
              track-by="id"
              :show-labels="false"
            ></reworked-multiselect>
          </div>
          <div class="col-lg-6">
            <div class="input-group">
              <reworked-multiselect
                key="value"
                v-model="selectedStatus"
                class="inline-block"
                :multiple="false"
                :options="statuses"
                :disabled="loading"
                label="label"
                track-by="value"
                placeholder="Статус"
              />
            </div>
          </div>
        </div>
      </template>
      <template #item-user_id="{ item }">
        {{ item.user?.name }}
      </template>
      <template #item-created_at="{ item }">
        {{ $filters.formatDateTime(item.created_at) }}
      </template>

      <template #item-crypto_amount_info="{ item }">
        {{ formatAmount(item.crypto_amount_info) }}
        {{ item.crypto_amount_info?.currency_code }}
      </template>
      <template #item-fiat_amount_info="{ item }">
        {{ formatAmount(item.fiat_amount_info) }}
        {{ item.fiat_amount_info?.currency_code }}
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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import DropdownDotsComponent from "@/components/DropdownDotsComponent.vue";
import StatusAttribute from "@/views/orders/partial/StatusAttribute.vue";
import { syncConfigs } from "@/stores/syncConfigs";
import { ReworkedMultiselect } from "@/components/reworked-multiselect";
import UserService from "@/services/UserService";

export default {
  components: {
    ReworkedMultiselect,
    StatusAttribute,
    DropdownDotsComponent,
    WrapperComponent,
    GridComponent,
    Datepicker,
  },
  setup() {
    const configStore2 = syncConfigs();
    const statuses = configStore2.orders.statuses;

    console.log(configStore2.orders);
    console.log(statuses);
    console.log(statuses);
    console.log(statuses);
    return {
      statuses: statuses,
    };
  },
  data: () => ({
    loading: false,
    meta: null,
    searchText: null,
    selectedStatus: null,
    orders: [],
    headers: [
      { text: "#", value: "id" },
      {
        text: "Клиент",
        value: "user_id",
      },
      { text: "Направление", value: "direction" },
      { text: "Сумма крипты", value: "crypto_amount_info" },
      { text: "Сумма фиата", value: "fiat_amount_info" },
      { text: "Статус", value: "status" },
      { text: "Дата", value: "created_at", custom_link: true },
      {
        text: "",
        value: "actions",
        width: "1%",
        custom_link: true,
      },
    ],
    period: [
      dayjs().tz("Europe/Kiev").format("YYYY-MM-01"),
      dayjs().tz("Europe/Kiev").format("YYYY-MM-DD"),
    ],

    users: [],
    userFilter: null,
    sortedColumn: null,
    direction: null,
  }),
  computed: {
    currentPage() {
      return this.$route.query.page || 1;
    },
  },
  watch: {
    "$route.query": {
      async handler() {
        await this.getOrders();
      },
      deep: true,
    },

    userFilter(value) {
      const searchTextValue = this.searchText?.trim() || null;
      this.pushQueryParams({
        user_id: value?.id,
        search: searchTextValue,
        page: 1,
      });

      this.pushQueryParams({ user_id: value?.id });
    },
    async period() {
      if (!this.period) {
        this.pushQueryParams({
          date_from: null,
          date_to: null,
          page: 1,
        });
        return;
      }
      const newFrom = this.period[0]
        ? dayjs(this.period[0]).format("YYYY-MM-DD")
        : null;
      const newTo = this.period[1]
        ? dayjs(this.period[1]).format("YYYY-MM-DD")
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
    },

    selectedStatus: function () {
      const searchTextValue = this.searchText?.trim() || null;
      this.pushQueryParams({
        status: this.selectedStatus?.value,
        search: searchTextValue,
        page: 1,
      });
    },
  },
  async created() {
    await this.loadUsers();

    const { date_from, date_to } = this.$route.query;

    const isValidDate = (d) => d && dayjs(d, "YYYY-MM-DD", true).isValid();

    this.period = [
      isValidDate(date_from) ? date_from : dayjs().startOf("month").toDate(),
      isValidDate(date_to) ? date_to : dayjs().endOf("day").toDate(),
    ];

    this.userFilter = this.users.find(
      (item) => item.id === parseInt(this.$route.query.user_id)
    );
    await this.getOrders();
  },
  methods: {
    async getOrders() {
      this.loading = true;
      const response = await API.apiClient.get("/orders", {
        params: pickBy(
          {
            date_from: this.$route.query.date_from,
            date_to: this.$route.query.date_to,
            sortedColumn: this.sortedColumn,
            direction: this.direction,
            page: this.currentPage,
            status: this.$route.query.status,
            user_id: this.$route.query.user_id,
            search: this.searchText,
          },
          identity
        ),
      });

      this.orders = response.data.data;
      this.meta = response.data.meta;

      this.loading = false;
    },
    async loadUsers() {
      const response = await UserService.getClients("-1");
      this.users = response.data.data;
    },
    sortOrders(sortedColumn, direction) {
      this.sortedColumn = sortedColumn;
      this.direction = direction;
      this.getOrders();
    },
    formatAmount(info) {
      if (!info) return "0.00";
      const val =
        info.amount !== undefined && info.amount !== null
          ? info.amount
          : info.rate;
      if (val === undefined || val === null) return "0.00";

      const amountValue = typeof val === "string" ? parseFloat(val) : val;
      const precision =
        info.precision !== undefined && info.precision !== null
          ? parseInt(info.precision)
          : 2;

      // Use en-US locale for consistent number formatting (period as decimal separator)
      // while respecting the dynamic precision and removing redundant trailing zeros.
      return amountValue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision,
      });
    },
    pushQueryParams(query) {
      this.$router.push({
        query: pickBy(
          {
            ...this.$route.query,
            ...query,
          },
          (val) => val !== null && val !== undefined && val !== ""
        ),
      });
    },
    onClickItem(item) {
      if (item.actions?.includes("update")) {
        this.$router.push({
          name: "orders.edit",
          params: { id: item.id },
        });
      }
    },
    async applySearch() {
      const value = this.searchText?.trim() || null;
      this.pushQueryParams({
        search: value,
        page: 1,
      });
    },
    async onEmptySearchInput() {
      if (!this.searchText) {
        this.pushQueryParams({
          search: null,
          page: 1,
        });
      }
    },
  },
};
</script>

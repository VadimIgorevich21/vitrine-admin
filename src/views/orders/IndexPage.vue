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
      @click-item="onClickItem"
    >
      <template #header>
        <div class="row">
          <div class="col-lg-12 mt-2">
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
    Datepicker,
  },
  data: () => ({
    loading: false,
    meta: null,
    operations: [],

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
    // period: [moment().format("YYYY-MM-01"), moment().format("YYYY-MM-DD")],
    period: [
      dayjs().tz("Europe/Kiev").format("YYYY-MM-01"),
      dayjs().tz("Europe/Kiev").format("YYYY-MM-DD"),
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
    sortOperations(sortedColumn, direction) {
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
    cancelOrder(order) {
      alert("cancel order");
      console.log("cancel order " + order);
    },
  },
};
</script>

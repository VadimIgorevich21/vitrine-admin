<template>
  <div class="public-sans-fonts">
    <wrapper-component>
      <template #title> Telegram Сообщения </template>
      <template #header-elements>
        <router-link
          :to="{ name: 'telegram-messages.create' }"
          class="btn btn-primary"
        >
          Добавить
        </router-link>
      </template>
      <div id="infiniteBlock" class="result">
        <grid-component
          :items="telegramMessages"
          resource-url="telegram-messages"
          :headers="headers"
          :loading="loading"
          :per-page="meta?.per_page ?? 0"
          :items-total="meta?.total ?? 0"
          :message-for-empty-table="'Записей не найдено.'"
        >
          <template #header>
            <div class="row mt-2">
              <div class="col-lg-6">
                <div class="input-group input-group-sm">
                  <span class="input-group-prepend">
                    <span
                      class="input-group-text bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-300"
                    >
                      Тип
                    </span>
                  </span>
                  <select
                    v-model="selectedType"
                    class="custom-select custom-select-sm dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400"
                  >
                    <option value="">Все</option>
                    <option value="custom_message">custom_message</option>
                    <option value="automatic_message">automatic_message</option>
                  </select>
                </div>
              </div>
              <div class="col-lg-6">
                <div class="input-group input-group-sm">
                  <span class="input-group-prepend">
                    <span
                      class="input-group-text bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-300"
                    >
                      Статус
                    </span>
                  </span>
                  <select
                    v-model="selectedStatus"
                    class="custom-select custom-select-sm dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400"
                  >
                    <option value="">Все</option>
                    <option value="sent">sent</option>
                    <option value="created">created</option>
                    <option value="failed">failed</option>
                    <option value="tg_deleted">tg_deleted</option>
                  </select>
                </div>
              </div>
            </div>
          </template>
          <template #item-user="{ item }">
            <span>{{ item.user?.name ?? "Нет" }}</span>
          </template>
          <template #item-operation="{ item }">
            <span>{{
              item.operation?.operation_code ?? item.operation?.id ?? "Нет"
            }}</span>
          </template>
          <template #item-text="{ item }">
            <span>{{ $filters.truncate(item.text) }}</span>
          </template>
        </grid-component>
        <infinite-loading @infinite="getTelegramMessages">
          <template #spinner>
            <div class="hidden"></div>
          </template>
        </infinite-loading>
      </div>
    </wrapper-component>
  </div>
</template>
<script>
import WrapperComponent from "@/components/WrapperComponent.vue";
import GridComponent from "./partial/GridComponent.vue";
import InfiniteLoading from "v3-infinite-loading";
import * as API from "@/services/API";
import { identity, pickBy } from "lodash";

export default {
  components: { InfiniteLoading, GridComponent, WrapperComponent },
  data: () => ({
    page: 1,
    telegramMessages: [],
    loading: false,
    selectedType: null,
    selectedStatus: null,
    headers: [
      {
        text: "ID",
        value: "id",
        width: "10%",
        custom_link: true,
      },
      {
        text: "Пользователь",
        value: "user",
        width: "20%",
        custom_link: true,
      },
      {
        text: "Операция",
        value: "operation",
        width: "10%",
        class: "",
        custom_link: true,
      },
      {
        text: "Текст",
        value: "text",
        width: "20%",
        class: "",
        custom_link: true,
      },
      {
        text: "Тип",
        value: "type",
        width: "20%",
        class: "",
        custom_link: true,
      },
      {
        text: "Статус",
        value: "status",
        width: "20%",
        class: "",
        custom_link: true,
      },
    ],
    meta: null,
  }),
  watch: {
    selectedType: function () {
      this.page = 1;
      this.meta = null;
      this.telegramMessages = [];
      this.getTelegramMessages();
    },
    selectedStatus: function () {
      this.page = 1;
      this.meta = null;
      this.telegramMessages = [];
      this.getTelegramMessages();
    },
  },
  async created() {
    await this.getTelegramMessages();
  },
  methods: {
    async getTelegramMessages() {
      if (this.telegramMessages.length === this.meta?.total || this.loading) {
        return;
      }
      this.loading = true;
      const response = await API.apiClient.get("/telegram-messages", {
        params: pickBy(
          {
            type: this.selectedType,
            status: this.selectedStatus,
            page: this.page,
            includes: ["user", "operation"],
          },
          identity
        ),
      });

      this.telegramMessages = [...this.telegramMessages, ...response.data.data];
      if (this.page === 1) {
        this.telegramMessages = response.data.data;
      }

      this.meta = response.data.meta;
      this.page++;
      this.loading = false;

      this.$nextTick(() => {
        let resultBody = document.getElementById("infiniteBlock");
        if (
          resultBody &&
          resultBody.offsetHeight < window.innerHeight &&
          window.innerWidth > 1024
        ) {
          this.getTelegramMessages();
        }
      });
    },
  },
};
</script>

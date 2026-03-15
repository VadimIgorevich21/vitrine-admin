<template>
  <wrapper-component>
    <template #title> Клиенты </template>
    <div
      class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border shadow"
    >
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
      <perfect-scrollbar>
        <div class="wrapping-table">
          <table
            class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th scope="col" class="uppercase px-6 py-3">#</th>
                <th scope="col" class="uppercase px-6 py-3">Имя</th>
                <th scope="col" class="uppercase px-6 py-3">Почта</th>
                <th scope="col" class="uppercase px-6 py-3">
                  Последняя активность
                </th>
                <th scope="col" class="uppercase px-6 py-3"></th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr
                v-for="client in clients"
                :key="client"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50"
              >
                <td class="px-6 py-4">{{ client.id }}</td>
                <td class="px-6 py-4">{{ client.name }}</td>
                <td class="px-6 py-4">{{ client.email }}</td>
                <td class="px-6 py-4">
                  <span v-if="!client.activity_at" class="text-muted"
                    >Не было</span
                  >
                  {{ $filters.formatDateTime(client.activity_at) }}
                </td>
                <td class="px-6 py-4">
                  <dropdown-dots-component
                    v-if="client.actions.includes('update')"
                  >
                    <template #dropdown-items>
                      <router-link
                        v-if="
                          client.actions && client.actions.includes('update')
                        "
                        :to="{
                          name: 'clients.edit',
                          params: { id: client.id },
                        }"
                        class="dropdown-dots-item"
                      >
                        <i class="fe fe-edit-2 mr-2" /> Редактировать
                      </router-link>
                      <button
                        v-if="
                          client.actions && client.actions.includes('delete')
                        "
                        class="dropdown-dots-item text-red-400"
                        @click.prevent="deleteClient(client)"
                      >
                        <i class="fe fe-trash mr-2" /> Удалить
                      </button>
                    </template>
                  </dropdown-dots-component>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </perfect-scrollbar>
      <loading-component :enabled="loading" />

      <div v-if="!loading && clients.length > 0" class="card-footer">
        <pagination-component :per-page="meta.per_page" :total="meta.total" />
      </div>

      <div
        v-if="!loading && clients.length === 0"
        class="pt-5 text-gray-700 dark:text-gray-400 card-footer font-size-sm"
      >
        Пользователей не найдено.
      </div>
    </div>
  </wrapper-component>
</template>

<script>
import WrapperComponent from "@/components/WrapperComponent.vue";
import PaginationComponent from "@/components/PaginationComponent.vue";
import LoadingComponent from "@/components/LoadingComponent.vue";
import DropdownDotsComponent from "@/components/DropdownDotsComponent.vue";
import UserService from "@/services/UserService";
import { identity, pickBy } from "lodash";

export default {
  components: {
    WrapperComponent,
    PaginationComponent,
    LoadingComponent,
    DropdownDotsComponent,
  },
  data: () => ({
    loading: false,
    clients: [],
    meta: null,
    searchText: null,
  }),

  computed: {
    currentPage() {
      return this.$route.query.page || 1;
    },
  },

  watch: {
    "$route.query.page": function () {
      this.getClients();
    },
  },

  async created() {
    this.searchText = this.$route.query.search ?? null;

    await this.getClients();
  },

  methods: {
    async getClients() {
      this.loading = true;

      const response = await UserService.getClients(this.currentPage, {
        params: {
          query: this.searchText,
          page: this.currentPage,
          includes: ["roles"],
        },
      });

      this.clients = response.data.data;
      this.meta = response.data.meta;

      this.loading = false;
    },

    async deleteClient(client) {
      if (
        !confirm(
          "Вы действительно хотите удалить пользователя " + client.name + "?"
        )
      ) {
        return;
      }

      await UserService.deleteUser(client.id);
      await this.getClients();
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
  },
};
</script>

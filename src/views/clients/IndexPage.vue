<template>
  <wrapper-component>
    <template #title> Клиенты </template>
    <div
      class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border shadow"
    >
      <div class="card-header h-auto pb-3">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="flex items-center gap-2">
              <div class="relative flex-1 group">
                <Icon
                  icon="heroicons:magnifying-glass"
                  class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors pointer-events-none"
                />
                <input
                  ref="searchInput"
                  v-model="searchText"
                  type="search"
                  class="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all"
                  placeholder="Поиск клиентов..."
                  @keyup.enter="applySearch"
                  @input="onEmptySearchInput"
                />
              </div>
              <button
                class="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center gap-2"
                @click="applySearch"
              >
                Поиск
              </button>
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
                  Статус верификации
                </th>
                <th scope="col" class="uppercase px-6 py-3">Доступ</th>
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
                  <KycStatusAttribute :user="client"></KycStatusAttribute>
                </td>

                <td class="px-6 py-4">
                  <span v-if="client.has_access"> Active </span>
                  <span v-else class="text-red-500"> Blocked </span>
                </td>
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
                        v-if="client.actions.includes('enable')"
                        class="dropdown-dots-item"
                        @click.prevent="enableClient(client)"
                      >
                        <i class="fe fe-eye mr-2" />
                        Включить
                      </button>
                      <button
                        v-if="client.actions.includes('disable')"
                        class="dropdown-dots-item text-danger"
                        @click.prevent="disableClient(client)"
                      >
                        <i class="fe fe-eye-off mr-2" />
                        Отключить
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
import KycStatusAttribute from "@/views/clients/partial/KycStatusAttribute.vue";
import { notify } from "@kyvg/vue3-notification";
import { Icon } from "@iconify/vue";

export default {
  components: {
    Icon,
    KycStatusAttribute,
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

    async enableClient(client) {
      if (confirm("Вы действительно хотите включить доступ?")) {
        try {
          const response = await UserService.enableClient(client.id);

          this.clients[this.clients.indexOf(client)] = response.data.data;

          notify({
            group: "default",
            type: "vue-notification success",
            duration: 3000,
            title: "Info",
            text: "Доступ успешно включен",
          });
        } catch (e) {
          notify({
            group: "default",
            type: "error",
            duration: 3000,
            title: "Error",
            text: "Ошибка при выполнении запроса",
          });
        }
      }
    },

    async disableClient(client) {
      if (confirm("Вы действительно хотите отключить доступ?")) {
        try {
          const response = await UserService.disableClient(client.id);

          this.clients[this.clients.indexOf(client)] = response.data.data;

          notify({
            group: "default",
            type: "vue-notification success",
            duration: 3000,
            title: "Info",
            text: "Доступ успешно отключен",
          });
        } catch (e) {
          notify({
            group: "default",
            type: "error",
            duration: 3000,
            title: "Error",
            text: "Ошибка при выполнении запроса",
          });
        }
      }
    },
  },
};
</script>

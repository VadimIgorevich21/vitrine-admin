<template>
  <wrapper-component>
    <template #title> Пользователи </template>

    <template #header-elements>
      <router-link :to="{ name: 'users.create' }" class="btn btn-primary">
        Добавить
      </router-link>
    </template>
    <div
      class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border shadow"
    >
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
                <th scope="col" class="uppercase px-6 py-3">Роль</th>
                <th scope="col" class="uppercase px-6 py-3">
                  Последняя активность
                </th>
                <th scope="col" class="uppercase px-6 py-3"></th>
              </tr>
            </thead>
            <tbody v-if="!loading">
              <tr
                v-for="user in users"
                :key="user"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50"
              >
                <td class="px-6 py-4">{{ user.id }}</td>
                <td class="px-6 py-4">{{ user.name }}</td>
                <td class="px-6 py-4">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <span v-if="user.roles.length <= 0" class="text-muted"
                    >Нет</span
                  >
                  {{ user.roles.map((r) => r.title).join(", ") }}
                </td>
                <td class="px-6 py-4">
                  <span v-if="!user.activity_at" class="text-muted"
                    >Не было</span
                  >
                  {{ $filters.formatDateTime(user.activity_at) }}
                </td>
                <td class="px-6 py-4">
                  <dropdown-dots-component
                    v-if="
                      user.actions.includes('update') ||
                      user.actions.includes('delete')
                    "
                  >
                    <template #dropdown-items>
                      <router-link
                        v-if="user.actions && user.actions.includes('update')"
                        :to="{
                          name: 'users.edit',
                          params: { id: user.id },
                        }"
                        class="dropdown-dots-item"
                      >
                        <i class="fe fe-edit-2 mr-2" /> Редактировать
                      </router-link>
                      <button
                        v-if="user.actions && user.actions.includes('delete')"
                        class="dropdown-dots-item text-red-400"
                        @click.prevent="deleteUser(user)"
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

      <div v-if="!loading && users.length > 0" class="card-footer">
        <pagination-component :per-page="meta.per_page" :total="meta.total" />
      </div>

      <div
        v-if="!loading && users.length === 0"
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

export default {
  components: {
    WrapperComponent,
    PaginationComponent,
    LoadingComponent,
    DropdownDotsComponent,
  },
  data: () => ({
    loading: false,
    users: [],
    meta: null,
  }),

  computed: {
    currentPage() {
      return this.$route.query.page || 1;
    },
  },

  watch: {
    "$route.query.page": function () {
      this.getUsers();
    },
  },

  async created() {
    await this.getUsers();
  },

  methods: {
    async getUsers() {
      this.loading = true;

      const response = await UserService.getUsers(this.currentPage, {
        params: {
          page: this.currentPage,
          includes: ["roles"],
        },
      });

      this.users = response.data.data;
      this.meta = response.data.meta;

      this.loading = false;
    },

    async deleteUser(user) {
      if (
        !confirm(
          "Вы действительно хотите удалить пользователя " + user.name + "?"
        )
      ) {
        return;
      }

      await UserService.deleteUser(user.id);
      await this.getUsers();
    },
  },
};
</script>

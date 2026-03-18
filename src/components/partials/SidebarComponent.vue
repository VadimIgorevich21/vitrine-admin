<template>
  <!-- sidebar -->
  <nav
    class="sidebar flex flex-col h-screen bg-gray-50/50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-colors duration-300 overflow-y-auto"
  >
    <!-- sidebar head -->
    <div
      class="sidebar-head px-5 py-5 flex items-center justify-start bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700/50 shadow-sm mb-2"
    >
      <router-link
        to="/"
        exact
        class="hover:opacity-80 transition-opacity duration-300"
      >
        <img
          src="../../assets/img/logo.png"
          alt="Logo"
          style="width: 120px"
          class="logo opacity-90"
        />
      </router-link>
      <button
        class="lg:hidden absolute top-5 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        @click="sidebarToggle"
      >
        <Icon icon="heroicons:x-mark" class="w-6 h-6" />
      </button>
    </div>

    <!-- sidebar navigation -->
    <div class="flex-grow px-2 space-y-0.5">
      <div v-if="is('admin') || can('test')">
        <router-link
          to="/orders"
          exact
          class="nav-link-custom group flex !flex-row items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent"
          active-class="!bg-white dark:!bg-gray-800 !text-indigo-600 dark:!text-indigo-400 !border-gray-200 dark:!border-gray-700 shadow-sm"
        >
          <Icon
            icon="heroicons:shopping-cart"
            class="w-5 h-5 mr-3 flex-shrink-0"
          />
          <span class="whitespace-nowrap">Заказы</span>
        </router-link>
      </div>
      <div v-if="is('admin') || can('test')">
        <router-link
          to="/clients"
          exact
          class="nav-link-custom group flex !flex-row items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent"
          active-class="!bg-white dark:!bg-gray-800 !text-indigo-600 dark:!text-indigo-400 !border-gray-200 dark:!border-gray-700 shadow-sm"
        >
          <Icon icon="heroicons:users" class="w-5 h-5 mr-3 flex-shrink-0" />
          <span class="whitespace-nowrap">Клиенты</span>
        </router-link>
      </div>
    </div>

    <!-- sidebar footer -->
    <div
      class="p-2 mt-auto border-t border-gray-200 dark:border-gray-800 space-y-0.5 bg-gray-50/80 dark:bg-gray-900/50"
    >
      <div v-if="is('admin')">
        <router-link
          to="/users"
          class="nav-link-custom group flex !flex-row items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent"
          active-class="!bg-white dark:!bg-gray-800 !text-indigo-600 dark:!text-indigo-400 !border-gray-200 dark:!border-gray-700 shadow-sm"
        >
          <Icon
            icon="heroicons:user-group"
            class="w-5 h-5 mr-3 flex-shrink-0"
          />
          <span class="whitespace-nowrap">Пользователи</span>
        </router-link>
      </div>
      <div>
        <router-link
          to="/settings/change-password"
          class="nav-link-custom group flex !flex-row items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent"
          active-class="!bg-white dark:!bg-gray-800 !text-indigo-600 dark:!text-indigo-400 !border-gray-200 dark:!border-gray-700 shadow-sm"
        >
          <Icon
            icon="heroicons:cog-6-tooth"
            class="w-5 h-5 mr-3 flex-shrink-0"
          />
          <span class="whitespace-nowrap">Настройки</span>
        </router-link>
      </div>
      <button
        class="w-full group flex !flex-row items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
        @click="authStore.logout"
      >
        <Icon
          icon="heroicons:arrow-right-on-rectangle"
          class="w-5 h-5 mr-3 flex-shrink-0"
        />
        <span class="whitespace-nowrap">Выход</span>
      </button>
    </div>
  </nav>
</template>
<script>
import { Icon } from "@iconify/vue";
import { useAuth } from "@/stores/authStore";
import { syncConfigs } from "@/stores/syncConfigs";
import { mapState } from "pinia";

export default {
  components: {
    Icon,
  },
  setup() {
    const authStore = useAuth();
    const is = authStore.is;
    const can = authStore.can;

    const configStore2 = syncConfigs();
    const countActualOperations = configStore2.countActualOperations;
    return {
      authStore: authStore,
      is: is,
      can: can,
      countActualOperations: countActualOperations,
      configStore2: configStore2,
    };
  },
  data() {
    return {
      menuItems: [],
    };
  },
  computed: {
    ...mapState(syncConfigs, {
      customerTypes: "customers",
    }),
  },
  methods: {
    sidebarToggle: function () {
      this.$emit("close");
    },
  },
};
</script>
<style>
.active {
}
</style>

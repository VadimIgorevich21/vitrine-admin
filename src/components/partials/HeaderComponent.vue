<template>
  <!-- this header -->
  <header class="bg-white dark:bg-gray-800 p-2 border-b-2 dark:border-gray-700">
    <div class="wrap-header flex items-center justify-between flex-wrap">
      <div class="flex flex-no-shrink items-center">
        <button
          ref="showSidebar"
          class="text-gray-500 lg:hidden ml-3 block"
          @click="sidebarToggle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="img"
            width="2em"
            height="2em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 16 16"
          >
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M2.75 12.25h10.5m-10.5-4h10.5m-10.5-4h10.5"
            />
          </svg>
        </button>
        <h2
          class="text-md text-indigo-800 ml-3 lg:block hidden px-5 p-2 rounded-md bg-indigo-200"
        >
          Добро пожаловать, {{ authStore.identity.name }}
        </h2>
      </div>
      <div
        v-for="(currency, key) in exchangeRates"
        :key="currency"
        class="lg:block hidden"
      >
        <strong class="dark:text-gray-200">{{ key }}</strong>
        <ul v-for="rate in currency" :key="rate">
          <li class="dark:text-gray-200">
            {{ rate.code }} : {{ rate.sale.toFixed(4) }} /
            {{ rate.buy.toFixed(4) }}
          </li>
        </ul>
      </div>

      <div class="mr-5 flex">
        <div
          class="input-box border dark:bg-gray-900 dark:border-gray-700 rounded-md mr-5 hidden lg:w-search w-full box-border focus-within:bg-gray-100 dark:focus-within:bg-gray-700"
        >
          <span class="text-3xl p-2 text-gray-400"
            ><Icon icon="ei:search"
          /></span>
          <input
            type="text"
            placeholder="Search..."
            class="p-3 w-full bg-white dark:bg-gray-900 rounded-md outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
          />
        </div>
        <button
          id="theme-toggle"
          type="button"
          class="text-gray-500 mr-5 dark:text-gray-400 h outline-none rounded-lg text-sm p-2.5"
        >
          <svg
            id="theme-toggle-light-icon"
            class="hidden w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            ></path>
          </svg>
          <svg
            id="theme-toggle-dark-icon"
            class="hidden w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </button>

        <div class="!hidden block relative">
          <div class="flex h-full">
            <button
              class="mr-5 text-2xl text-gray-500"
              @click="showNoticicationsToggle"
              @blur="showNoticicationsToggleBlur"
            >
              <Icon class="inline-block" icon="clarity:notification-line" />
              <span
                v-if="unreadNotificationsCount"
                class="bg-red-200 rounded-full text-xs py-1 px-2 text-red-700"
                >{{ unreadNotificationsCount }}</span
              >
            </button>
          </div>

          <transition name="fade">
            <div
              v-show="showNoticications"
              id="dropdownSmall"
              class="block z-10 user-notification-wrapper border dark:border-gray-700 bg-white dark:bg-gray-800 rounded shadow notification-list"
            >
              <user-notifications-component
                :notifications="userNotifications"
              ></user-notifications-component>
            </div>
          </transition>
        </div>
        <button @click="menuToggle">
          <div
            class="user-avatar flex hover:bg-gray-100 dark:hover:bg-gray-700 p-1 cursor-pointer rounded-md"
          >
            <img
              src="../../assets/img/user.jpg"
              class="rounded-full mr-4 w-10 h-10 p-1 ring-1 ring-gray-300 dark:ring-gray-500"
              alt=""
            />
            <span class="text-md mt-4 text-gray-300"
              ><Icon icon="bi:caret-down-fill"
            /></span>
          </div>
        </button>

        <transition name="fade">
          <div
            v-show="menu"
            id="dropdownSmall"
            ref="menu"
            class="block absolute right-10 mt-12 z-10 w-44 border dark:border-gray-700 bg-white dark:bg-gray-800 rounded divide-y dark:divide-gray-700 divide-gray-100 shadow"
          >
            <div class="py-3 px-4 text-sm text-gray-900 dark:text-gray-200">
              <div class="hidden">Logged As</div>
              <div class="font-medium truncate">
                {{ authStore.identity.name }}
              </div>
            </div>
            <ul
              class="py-1 text-sm text-gray-700 overflow-y-auto max-h-[400px] md:max-h-[500px] dark:text-gray-200"
              aria-labelledby="dropdownSmallButton"
            >
              <li v-if="is('admin')">
                <router-link
                  to="/users"
                  class="block py-2 px-4 hover:bg-primary hover:text-white"
                  @click="menu = false"
                >
                  <i class="fe fe-users mr-2"></i> Пользователи
                </router-link>
              </li>
              <li v-if="can('changePassword')">
                <router-link
                  to="/settings/change-password"
                  class="block py-2 px-4 hover:bg-primary hover:text-white"
                  @click="menu = false"
                >
                  <i class="fe fe-settings mr-2"></i> Настройки
                </router-link>
              </li>
            </ul>
            <div class="py-1">
              <a
                href="#"
                class="block py-2 px-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white"
                @click="authStore.logout"
                >Выход</a
              >
            </div>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script>
import { Icon } from "@iconify/vue";
import { useAuth } from "@/stores/authStore";
import { syncConfigs } from "@/stores/syncConfigs";
import UserNotificationsComponent from "@/components/partials/UserNotificationsComponent.vue";
import { storeToRefs } from "pinia";
import * as API from "@/services/API";

export default {
  components: {
    UserNotificationsComponent,
    Icon,
  },
  setup() {
    const authStore = useAuth();
    const is = authStore.is;
    const can = authStore.can;

    const configStore2 = syncConfigs();
    const notifications = configStore2.notifications;
    const unreadNotificationsCount = configStore2.unreadNotificationsCount;
    const { exchangeRates } = storeToRefs(configStore2);
    return {
      authStore: authStore,
      is: is,
      can: can,
      exchangeRates: exchangeRates,
      userNotifications: notifications,
      unreadNotificationsCount: unreadNotificationsCount,
      configStore2: configStore2,
    };
  },
  data() {
    return {
      menu: false,
      showNoticications: false,
      modal: false,
    };
  },
  watch: {
    "configStore2.maintenanceNotification": {
      handler(notification) {
        this.modal = !!notification;
      },
      immediate: true,
    },
  },
  created() {
    document.onclick = this.sidebarHide;
    window.addEventListener("click", this.windowOnClick);
  },
  beforeUnmount() {
    window.removeEventListener("click", this.windowOnClick);
  },
  methods: {
    windowOnClick(event) {
      if (!this.$refs.menu.contains(event.target)) {
        this.menu = false;
      }
    },
    menuToggle: function (event) {
      event.stopPropagation();
      this.menu = !this.menu;
    },
    showNoticicationsToggle: function () {
      this.showNoticications = !this.showNoticications;
    },
    showNoticicationsToggleBlur: function () {
      this.showNoticications = false;
    },
    sidebarToggle: function () {
      document.querySelector(".flex-sidebar").classList.remove("hidden");
    },
    sidebarHide: function (e) {
      let el = this.$refs.showSidebar;
      let target = e.target;
      if (el !== target && !el.contains(target)) {
        document.querySelector(".flex-sidebar").classList.add("hidden");
      }
    },
    customLogout() {
      this.authStore.setToLogout();
      this.authStore.logout();
    },
    clickOk() {
      this.readNotification();
      this.modal = false;
    },
    onCloseModal() {
      this.modal = false;
    },
    async readNotification() {
      await API.apiClient.post(
        "/notifications/" +
          this.configStore2.maintenanceNotification.id +
          "/read"
      );

      this.configStore2.updateConfigs();
      //let newNotifications = response.data.data.notifications;
      //this.modal = false;
    },
  },
};
</script>

<style type="text/scss" scoped>
.notification-list {
  max-height: 350px;
  overflow: scroll;
  position: absolute;
}

#dropdownSmall {
  z-index: 9999;
}
</style>

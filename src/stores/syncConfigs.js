import { defineStore } from "pinia";
import ConfigService from "@/services/ConfigService";

export const syncConfigs = defineStore("syncConfigs", {
  state: () => {
    return {
      mainConfigs: [],
      exchangeRates: [],
      loading: false,
    };
  },

  actions: {
    async getMainConfigs() {
      this.loading = true;

      let configs = null;

      try {
        if (!localStorage.getItem("configs")) {
          const response = await ConfigService.getConfigs();
          localStorage.setItem("configs", JSON.stringify(response.data.data));
          configs = response.data.data;
        } else {
          configs = JSON.parse(localStorage.getItem("configs"));
        }
        this.mainConfigs = configs;
        this.exchangeRates = configs?.exchange_rates;
      } catch (err) {
        this.mainConfigs = [];
        console.error("Error loading new arrivals:", err);
        return err;
      }

      this.loading = false;
    },
    async updateConfigs() {
      try {
        const response = await ConfigService.getConfigs();
        localStorage.setItem("configs", JSON.stringify(response.data.data));
        this.mainConfigs = response.data.data;
        this.exchangeRates = response.data.data?.exchange_rates;
      } catch (err) {
        this.mainConfigs = [];
        console.error("Error loading new arrivals:", err);
      }
    },
    setNotifications(notifications) {
      // this.$patch((state) => {
      //   state.mainConfigs.notifications = notifications ?? [];
      // });
      this.mainConfigs.notifications = notifications ?? [];
    },
    setUnreadNotificationsCount(count) {
      this.$patch((state) => {
        state.mainConfigs.unreadNotificationsCount = count ?? [];
      });
      this.mainConfigs.unreadNotificationsCount = count ?? null;
    },
  },

  getters: {
    configs(state) {
      return state.mainConfigs;
    },

    maintenanceNotification(state) {
      let notification = state?.mainConfigs?.maintenanceNotification;
      if (!notification) {
        return null;
      }

      if (typeof notification.content === "string") {
        notification.content = JSON.parse(notification.content);
      }

      return notification;
    },

    currencies(state) {
      return {
        all:
          state.mainConfigs &&
          state.mainConfigs.currencies &&
          state.mainConfigs.currencies.all
            ? state.mainConfigs.currencies.all
            : [],
      };
    },

    contacts(state) {
      return {
        types:
          state.mainConfigs &&
          state.mainConfigs.contacts &&
          state.mainConfigs.contacts.types
            ? state.mainConfigs.contacts.types
            : [],
      };
    },

    orders(state) {
      return {
        types:
          state.mainConfigs &&
          state.mainConfigs.orders &&
          state.mainConfigs.orders.types
            ? state.mainConfigs.orders.types
            : [],

        statuses:
          state.mainConfigs &&
          state.mainConfigs.orders &&
          state.mainConfigs.orders.statuses
            ? state.mainConfigs.orders.statuses
            : [],

        payment_methods:
          state.mainConfigs &&
          state.mainConfigs.orders &&
          state.mainConfigs.orders.payment_methods
            ? state.mainConfigs.orders.payment_methods
            : [],
      };
    },
    // approveReasons(state) {
    //   return {
    //     approveReasons:
    //       state.mainConfigs && state.mainConfigs.approveReasons
    //         ? state.mainConfigs.approveReasons
    //         : [],
    //   };
    // },

    countries(state) {
      return (state.mainConfigs && state.mainConfigs.countries) || [];
    },

    users(state) {
      return {
        roles:
          state.mainConfigs &&
          state.mainConfigs.users &&
          state.mainConfigs.users.roles
            ? state.mainConfigs.users.roles
            : [],
        kyc_statuses:
          state.mainConfigs &&
          state.mainConfigs.users &&
          state.mainConfigs.users.kyc_statuses
            ? state.mainConfigs.users.kyc_statuses
            : [],
      };
    },

    authentication(state) {
      return {
        statuses:
          state.mainConfigs &&
          state.mainConfigs.authentication &&
          state.mainConfigs.authentication.statuses
            ? state.mainConfigs.authentication.statuses
            : [],
      };
    },
  },
});

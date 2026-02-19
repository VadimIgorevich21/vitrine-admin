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

    countActualOperations(state) {
      return state.mainConfigs && state.mainConfigs.countActualOperations
        ? state.mainConfigs.countActualOperations
        : null;
    },

    unreadNotificationsCount(state) {
      return state.mainConfigs && state.mainConfigs.unreadNotificationsCount
        ? state.mainConfigs.unreadNotificationsCount
        : null;
    },

    allOperationsToProcessingCount(state) {
      return state.mainConfigs &&
        state.mainConfigs.allOperationsToProcessingCount
        ? state.mainConfigs.allOperationsToProcessingCount
        : null;
    },

    operationsToVerificationCount(state) {
      return state.mainConfigs &&
        state.mainConfigs.operationsToVerificationCount
        ? state.mainConfigs.operationsToVerificationCount
        : null;
    },

    unreadOperationsCount(state) {
      return state.mainConfigs && state.mainConfigs.unreadOperationsCount
        ? state.mainConfigs.unreadOperationsCount
        : null;
    },

    notifications(state) {
      return state.mainConfigs && state.mainConfigs.notifications
        ? state.mainConfigs.notifications
        : [];
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
        allWithIrrelevant:
          state.mainConfigs &&
          state.mainConfigs.currencies &&
          state.mainConfigs.currencies.allWithIrrelevant
            ? state.mainConfigs.currencies.allWithIrrelevant
            : [],
        withoutCryptocurrency:
          state.mainConfigs &&
          state.mainConfigs.currencies &&
          state.mainConfigs.currencies.withoutCryptocurrency
            ? state.mainConfigs.currencies.withoutCryptocurrency
            : [],
        onlyCryptocurrency:
          state.mainConfigs &&
          state.mainConfigs.currencies &&
          state.mainConfigs.currencies.onlyCryptocurrency
            ? state.mainConfigs.currencies.onlyCryptocurrency
            : [],
      };
    },

    statistics(state) {
      return {
        telegramCommandNames:
          state.mainConfigs &&
          state.mainConfigs.statistics &&
          state.mainConfigs.statistics.telegram_commands
            ? state.mainConfigs.statistics.telegram_commands
            : [],
      };
    },

    customers(state) {
      return {
        types:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.types
            ? state.mainConfigs.customers.types
            : [],
        reportTypes:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.reportTypes
            ? state.mainConfigs.customers.reportTypes
            : [],
        counterpartyDepositingTypes:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.counterpartyDepositingTypes
            ? state.mainConfigs.customers.counterpartyDepositingTypes
            : [],
        encashmentTypes:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.encashmentTypes
            ? state.mainConfigs.customers.encashmentTypes
            : [],
        activeCustomers:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.activeCustomers
            ? state.mainConfigs.customers.activeCustomers
            : [],
        salaryCustomers:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.salaryCustomers
            ? state.mainConfigs.customers.salaryCustomers
            : [],
        responsibilityTypes:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.responsibilityTypes
            ? state.mainConfigs.customers.responsibilityTypes
            : [],
        expenseGroups:
          state.mainConfigs &&
          state.mainConfigs.customers &&
          state.mainConfigs.customers.expenseGroups
            ? state.mainConfigs.customers.expenseGroups
            : [],
      };
    },

    statements(state) {
      return {
        statuses:
          state.mainConfigs &&
          state.mainConfigs.statements &&
          state.mainConfigs.statements.statuses
            ? state.mainConfigs.statements.statuses
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

    operations(state) {
      return {
        types:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.types
            ? state.mainConfigs.operations.types
            : [],

        statuses:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.statuses
            ? state.mainConfigs.operations.statuses
            : [],

        allOnlyTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.allOnlyTypes
            ? state.mainConfigs.operations.allOnlyTypes
            : [],

        operationTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.operationTypes
            ? state.mainConfigs.operations.operationTypes
            : [],

        operationIndexTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.operationIndexTypes
            ? state.mainConfigs.operations.operationIndexTypes
            : [],

        depositingCounterpartyTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.depositingCounterpartyTypes
            ? state.mainConfigs.operations.depositingCounterpartyTypes
            : [],

        cryptocurrencyTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.cryptocurrencyTypes
            ? state.mainConfigs.operations.cryptocurrencyTypes
            : [],

        cryptocurrencyIndexTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.cryptocurrencyIndexTypes
            ? state.mainConfigs.operations.cryptocurrencyIndexTypes
            : [],

        worldPermutationTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.worldPermutationTypes
            ? state.mainConfigs.operations.worldPermutationTypes
            : [],

        worldPermutationIndexTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.worldPermutationIndexTypes
            ? state.mainConfigs.operations.worldPermutationIndexTypes
            : [],

        dealTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.dealTypes
            ? state.mainConfigs.operations.dealTypes
            : [],

        dealIndexTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.dealIndexTypes
            ? state.mainConfigs.operations.dealIndexTypes
            : [],

        cashboxTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.cashboxTypes
            ? state.mainConfigs.operations.cashboxTypes
            : [],

        cashboxIndexTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.cashboxIndexTypes
            ? state.mainConfigs.operations.cashboxIndexTypes
            : [],

        depositingTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.depositingTypes
            ? state.mainConfigs.operations.depositingTypes
            : [],

        usdtAlignmentTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.usdtAlignmentTypes
            ? state.mainConfigs.operations.usdtAlignmentTypes
            : [],

        mobileTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.mobileTypes
            ? state.mainConfigs.operations.mobileTypes
            : [],

        adminLogTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.adminLogTypes
            ? state.mainConfigs.operations.adminLogTypes
            : [],

        coordinatorTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.coordinatorTypes
            ? state.mainConfigs.operations.coordinatorTypes
            : [],

        userScoreTypes:
          state.mainConfigs &&
          state.mainConfigs.operations &&
          state.mainConfigs.operations.userScoreTypes
            ? state.mainConfigs.operations.userScoreTypes
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

    approveReasons(state) {
      return (state.mainConfigs && state.mainConfigs.approveReasons) || [];
    },

    approveReasonMap(state) {
      const list =
        (state.mainConfigs && state.mainConfigs.approveReasons) || [];
      const map = {};
      for (let i = 0; i < list.length; i++) {
        const r = list[i];
        // защитимся от кривых данных
        if (r && r.key != null) {
          map[String(r.key)] = r.label != null ? String(r.label) : "";
        }
      }
      return map;
    },

    approveLabelByKey() {
      return (key) => (key ? this.approveReasonMap[key] || "" : "");
    },

    users(state) {
      return {
        roles:
          state.mainConfigs &&
          state.mainConfigs.users &&
          state.mainConfigs.users.roles
            ? state.mainConfigs.users.roles
            : [],
      };
    },

    instructions(state) {
      return {
        types:
          state.mainConfigs &&
          state.mainConfigs.instructions &&
          state.mainConfigs.instructions.types
            ? state.mainConfigs.instructions.types
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

    auditOperationsCount(state) {
      return state.mainConfigs && state.mainConfigs.auditOperationsCount
        ? state.mainConfigs.auditOperationsCount
        : [];
    },
  },
});

import { defineStore } from "pinia";
import { getError } from "../utils/helpers";
import AuthService from "../services/AuthService";

export const useAuth = defineStore({
  id: "authStore",
  state: () => ({
    user: null,
    toLogout: false,
    error: null,
    loading: false,
  }),

  actions: {
    async login(payload) {
      try {
        await AuthService.login(payload);
        await this.getAuthUser();
        if (this.loggedIn) {
          window.location = "/";
          this.router.push({ path: "/" });
        }
      } catch (error) {
        this.error = getError(error);
      }
    },
    async logout() {
      try {
        await AuthService.logout().then(() => {
          this.user = null;
          this.router.push({ path: "/login" });
          localStorage.removeItem("configs");
          localStorage.removeItem("user");
        });
      } catch (error) {
        this.user = null;
        this.error = getError(error);
      }
    },
    async getAuthUser() {
      try {
        this.loading = true;

        if (!localStorage.getItem("user")) {
          const response = await AuthService.getAuthUser();
          this.user = response.data.data;
          localStorage.setItem("user", JSON.stringify(response.data.data));
        } else {
          this.user = JSON.parse(localStorage.getItem("user"));
        }

        if (!localStorage.getItem("userId")) {
          localStorage.setItem("userId", this.user.id);
        }
      } catch (error) {
        this.user = null;
        this.loading = false;
        this.error = getError(error);
        return error;
      }
    },
    async updateUser() {
      try {
        this.loading = true;

        const response = await AuthService.getAuthUser();
        this.user = response.data.data;
        localStorage.setItem("user", JSON.stringify(response.data.data));

        if (!localStorage.getItem("userId")) {
          localStorage.setItem("userId", this.user.id);
        }
      } catch (error) {
        this.user = null;
        this.loading = false;
        this.error = getError(error);
        return error;
      }
    },
    setToLogout() {
      this.$patch((state) => {
        state.toLogout = true;
      });
      this.toLogout = true;

      this.$patch((state) => {
        state.user = null;
      });
      this.user = null;

      this.logout();
    },
  },

  getters: {
    identity: (state) => state.user,
    loggedIn: (state) => !!state.user,
    isAdmin: (state) => (state.user ? state.user.isAdmin : false),
    is: (state) => (roles) => {
      if (Array.isArray(roles) && state.user) {
        return state.user.roles.some((role) => roles.includes(role));
      }
      return state.user ? state.user.roles.includes(roles) : false;
    },
    can: (state) => (permission) => {
      return state.user ? state.user.permissions.includes(permission) : false;
    },
    toLogoutStatus: (state) => state.toLogout,
  },
});

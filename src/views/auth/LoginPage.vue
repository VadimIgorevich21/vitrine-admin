<template>
  <div class="">
    <div
      v-if="!loading && hasAccess && requestId"
      class="flex items-center justify-center h-screen px-6 bg-gray-200"
    >
      <div class="w-full max-w-sm p-6 bg-white rounded-md shadow-md">
        <div class="flex items-center justify-center">
          <img src="../../assets/img/logo.svg" alt="Logo" class="logo mr-3" />
          <span class="text-2xl font-semibold text-gray-700">Вход</span>
        </div>
        <p class="text-muted text-center mt-5 mb-5">
          Используйте ваш электронный адрес и пароль для входа в систему.
        </p>
        <form
          class="mt-4"
          @submit.prevent="authStore.login({ email, password, requestId })"
        >
          <label class="block">
            <span class="text-sm text-gray-700">Электронный адрес</span>
            <input
              v-model="email"
              type="email"
              class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            />
          </label>

          <label class="block mt-3">
            <span class="text-sm text-gray-700">Пароль</span>
            <input
              v-model="password"
              type="password"
              class="block w-full mt-1 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
            />
          </label>

          <div class="flex items-center justify-between mt-4">
            <div>
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  class="text-indigo-600 border-gray-200 rounded-md focus:border-indigo-600 focus:ring focus:ring-opacity-40 focus:ring-indigo-500"
                />
                <span class="mx-2 text-sm text-gray-600">Запомнить меня</span>
              </label>
            </div>

            <div>
              <a
                class="block text-sm text-indigo-700 fontme hover:underline"
                href="#"
              >
                Забыли пароль?</a
              >
            </div>
          </div>

          <div class="mt-6">
            <button
              type="submit"
              class="w-full px-4 py-2 text-sm text-center text-white bg-indigo-600 rounded-md focus:outline-none hover:bg-indigo-500"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="flex text-center items-center justify-center min-h-screen">
      <div
        v-if="!loading && error_message"
        class="font-bold text-2xl text-red-600 mb-10"
      >
        {{ error_message }}
      </div>
      <loading-component v-if="loading" />
    </div>
  </div>
</template>

<script>
import { useAuth } from "../../stores/authStore";
import LoadingComponent from "../../components/LoadingComponent.vue";
import * as API from "@/services/API";
import { FpjsClient } from "@fingerprintjs/fingerprintjs-pro-spa";

export default {
  components: {
    LoadingComponent,
  },
  setup() {
    const authStore = useAuth();

    return {
      authStore: authStore,
      // fp: fp,
    };
  },
  data() {
    return {
      loading: false,
      hasAccess: false,
      error_message: null,
      visitor: null,
      requestId: null,
      email: null,
      password: null,
      fp: null,
    };
  },
  async created() {
    await this.checkVpnLogin();
  },
  methods: {
    async checkVpnLogin() {
      const response = await API.apiClient.post("/check-vpn-login");

      if (response.data.success === true) {
        this.hasAccess = true;
        this.requestId = Math.random() * 10000;
      } else {
        await this.getVisitorData();
      }
    },
    async getVisitorData() {
      this.loading = true;

      let apiKey = import.meta.env.VITE_APP_FINGERPRINT_API_KEY;
      this.fp = new FpjsClient({
        loadOptions: {
          apiKey: apiKey,
        },
      });
      await this.fp.init(); // Ensure initialization
      const visitorData = await this.fp.getVisitorData({
        extendedResult: true,
      });

      this.visitor = visitorData;
      this.requestId = visitorData.requestId;
      await this.checkLogin();
      this.loading = false;
    },
    async checkLogin() {
      const response = await API.apiClient.post("/check-login", {
        requestId: this.visitor.requestId,
      });

      if (response.data.success === "true") {
        this.hasAccess = true;
      } else if (response.data.success === "refresh") {
        this.fp.clearCache();
        location.reload();
      } else if (response.data.error_message) {
        this.error_message = response.data.error_message;
      }
    },
  },
};
</script>

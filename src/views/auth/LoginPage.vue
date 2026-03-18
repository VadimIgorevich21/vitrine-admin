<template>
  <div
    class="relative min-h-screen flex items-center justify-center font-lexend overflow-hidden"
  >
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img
        src="../../assets/img/login-bg.png"
        class="w-full h-full object-cover"
        alt="Background"
      />
      <div
        class="absolute inset-0 bg-indigo-900/20 backdrop-brightness-75"
      ></div>
    </div>

    <!-- Login Card -->
    <div
      v-if="!loading && hasAccess && requestId"
      class="relative z-10 w-full max-w-md p-8 sm:p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 animation-fade-in"
    >
      <div class="flex flex-col items-center justify-center mb-8">
        <img
          src="../../assets/img/logo.png"
          style="width: 180px"
          alt="Logo"
          class="logo mb-4"
        />
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">
          Добро пожаловать
        </h1>
        <p class="text-sm text-gray-500 text-center mt-2 max-w-xs">
          Используйте ваш электронный адрес и пароль для входа в систему.
        </p>
      </div>

      <form
        class="space-y-6"
        @submit.prevent="authStore.login({ email, password, requestId })"
      >
        <div>
          <label class="block text-sm font-medium text-gray-700 ml-1 mb-1.5">
            Электронный адрес
          </label>
          <div class="relative group">
            <span
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-indigo-500 transition-colors"
            >
              <Icon icon="heroicons:envelope" class="w-5 h-5" />
            </span>
            <input
              v-model="email"
              type="email"
              placeholder="example@mail.com"
              class="block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              required
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between ml-1 mb-1.5">
            <label class="block text-sm font-medium text-gray-700">
              Пароль
            </label>
            <a
              class="text-xs font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors"
              href="#"
            >
              Забыли пароль?
            </a>
          </div>
          <div class="relative group">
            <span
              class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 group-focus-within:text-indigo-500 transition-colors"
            >
              <Icon icon="heroicons:lock-closed" class="w-5 h-5" />
            </span>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
              required
            />
          </div>
        </div>

        <div class="flex items-center">
          <label class="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
            />
            <span
              class="ml-2 text-sm text-gray-600 group-hover:text-gray-800 transition-colors"
              >Запомнить меня</span
            >
          </label>
        </div>

        <button
          type="submit"
          class="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
        >
          Войти в аккаунт
        </button>
      </form>
    </div>

    <!-- Error & Loading States -->
    <div
      v-if="loading || error_message"
      class="relative z-10 w-full max-w-md p-8 sm:p-10 text-center"
    >
      <div
        v-if="error_message"
        class="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-red-100 animation-shake"
      >
        <div
          class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Icon icon="heroicons:exclamation-triangle" class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Ошибка доступа</h3>
        <p class="text-red-600 font-medium">{{ error_message }}</p>
        <button
          class="mt-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors"
          @click="
            error_message = null;
            checkVpnLogin();
          "
        >
          Попробовать снова
        </button>
      </div>
      <div v-if="loading" class="flex flex-col items-center justify-center">
        <loading-component />
        <p class="mt-4 text-white font-medium drop-shadow-md">
          Проверка безопасности...
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuth } from "../../stores/authStore";
import LoadingComponent from "../../components/LoadingComponent.vue";
import { Icon } from "@iconify/vue";
import * as API from "@/services/API";
import { FpjsClient } from "@fingerprintjs/fingerprintjs-pro-spa";

export default {
  components: {
    LoadingComponent,
    Icon,
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

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animation-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.animation-shake {
  animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

/* Custom focus ring for better glass effect */
input:focus {
  background-color: rgba(255, 255, 255, 0.8) !important;
}
</style>

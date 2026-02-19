import { createApp, markRaw } from "vue";
import { createPinia } from "pinia";
import { Icon } from "@iconify/vue";
import router from "@/router";
import VueApexCharts from "vue3-apexcharts";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-green/theme.css";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import "@/assets/feather/feather.css";
import "@/assets/icomoon/styles.min.css";
import "@/assets/tailwind.css";
import "@/assets/animate.css";
import "@/assets/theme.min.css";
import "@/assets/custom.css";
// import "@/assets/fonts/PublicSans/public-sans.css";
import "@/assets/fonts/PT_Sans/pt-sans.css";
import "@/assets/fonts/Lexend/lexend.css";
// import moment from "moment";
import moment from "moment-timezone";
import App from "./App.vue";
import EmptyLayout from "./components/layouts/EmptyLayout.vue";
import DashboardLayout from "./components/layouts/DashboardLayout.vue";
import WrapperComponent from "./components/WrapperComponent.vue";
import LoadingComponent from "./components/LoadingComponent.vue";
import "tw-elements";
import "vue-universal-modal/dist/index.css";
import VueUniversalModal from "vue-universal-modal";
import "./pusher-notifications";
import Maska from "maska";
import Notifications from "@kyvg/vue3-notification";
import VueClipboard from "vue3-clipboard";
// import { fpjsPlugin } from "@fingerprintjs/fingerprintjs-pro-vue-v3";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import tooltip from "./mixins/tooltip.js";
import tooltip2 from "./mixins/tooltip2.js";
import "@/assets/tooltip.css";
import VueCountdown from "@chenfengyuan/vue-countdown";
import TreeSelectScrollFix from "./plugins/fix-treeselect-scroll.js";

const app = createApp(App);
const pinia = createPinia();
// add the router to Pina as a plugin
// gives you access to the router
// use this.router in any store
pinia.use(({ store }) => {
  store.router = markRaw(router);
});
app.component(VueCountdown.name, VueCountdown);

app.use(PrimeVue, {
  ripple: true,
});
app.use(TreeSelectScrollFix);
app.use(pinia);
app.component("EmptyLayout", EmptyLayout);
app.component("DefaultLayout", DashboardLayout);
app.component("WrapperComponent", WrapperComponent);
app.component("LoadingComponent", LoadingComponent);
app.component("QuillEditor", QuillEditor);
app.use(router);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.component(Icon);
app.use(Maska);
app.use(Notifications);
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
});
app.use(VueApexCharts);
app.use(PerfectScrollbar);
app.use(VueUniversalModal, {
  teleportTarget: "#modals",
});
app.directive("longmouseover", {
  beforeMount(el, binding) {
    let pressTimer = null;

    const handlePress = () => {
      binding.value();
    };

    const start = (e) => {
      if (e.type === "click" && e.button !== 0) {
        return;
      }

      if (pressTimer === null) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        pressTimer = setTimeout(handlePress, 750); // Задайте свой период для считывания длительного нажатия
      }
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    el.addEventListener("mouseover", start);
    el.addEventListener("mouseout", cancel);
  },
});
app.directive("tooltip", tooltip);
app.directive("tooltip2", tooltip2);
// app.use(fpjsPlugin, {
//   loadOptions: {
//     apiKey: import.meta.env.VITE_APP_FINGERPRINT_API_KEY,
//   },
// });

moment.tz.setDefault("Europe/Kiev");
app.config.globalProperties.$filters = {
  customRound(value) {
    if (value === null) {
      return null;
    }

    let number = parseFloat(value);
    const fraction = number % 1;
    const integerPart = Math.floor(number);

    if (fraction <= 0.5) {
      number = integerPart;
    } else {
      number = integerPart + 1;
    }

    return number
      .toLocaleString("uk-UA", {
        maximumFractionDigits: 2,
      })
      .replace(",", ".")
      .replace("-", "- ");
  },
  formatDateTime(value) {
    return value ? moment(String(value)).format("DD.MM.YYYY HH:mm:ss") : "";
  },
  formatDateTimeWithoutSeconds(value) {
    return value ? moment(String(value)).format("DD.MM.YYYY HH:mm") : "";
  },
  formatDate(value) {
    return value ? moment(String(value)).format("DD.MM.YYYY") : "";
  },
  formatDateMonthDay(value) {
    return value ? moment(String(value)).format("DD.MM") : "";
  },
  formatNumber(value) {
    if (value === null) {
      return null;
    }

    return Number(parseFloat(value).toFixed(4)).toLocaleString("uk-UA", {
      minimumFractionDigits: 2,
    });
  },
  formatRoundNumber(value) {
    if (value === null) {
      return null;
    }

    return Number(parseFloat(value).toFixed(0)).toLocaleString("uk-UA", {
      minimumFractionDigits: 2,
    });
  },
  formatNumberNew(value) {
    if (value === null) {
      return null;
    }

    return parseFloat(value)
      .toLocaleString("uk-UA", {
        maximumFractionDigits: 2,
      })
      .replace(",", ".")
      .replace("-", "- ");
  },
  formatFloatNumber(value) {
    if (value === null) {
      return null;
    }

    return Number(parseFloat(value).toFixed(4));
  },
  formatFloatNumberRound(value) {
    if (value === null) {
      return null;
    }

    return Number(parseFloat(value).toFixed(2));
  },
  formatUkraineFloatNumberRound(value) {
    if (value === null) {
      return null;
    }

    return Number(parseFloat(value).toFixed(2)).toLocaleString("uk-UA");
  },
  formatRoundNumberRanks(value) {
    if (value === null) {
      return null;
    }

    return Math.trunc(value).toLocaleString("uk-UA", {
      maximumFractionDigits: 2,
    });
  },
  highlight(text, query) {
    if (!query) {
      return text;
    }
    return text.replace(new RegExp(query.trim(), "gi"), (match) => {
      return "<span class='highlight'>" + match + "</span>";
    });
  },
  truncate(value, length = 30) {
    if (!value) return "";
    value = value.toString();
    if (value.length <= length) {
      return value;
    }
    return value.substring(0, length) + "...";
  },
};

app.mount("#app");

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.beforeEach((to, from, next) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // document.querySelector(".flex-sidebar").classList.add("hidden");
  next();
});

const linkElement = document.querySelector(
  "link[rel='icon']"
) as HTMLLinkElement | null;

if (linkElement && !window.location.hostname.includes("localhost")) {
  if (window.location.hostname.includes("vitrine")) {
    linkElement.href = "/favicon-stage.png";
  } else {
    linkElement.href = "/favicon-prod.png";
  }
}

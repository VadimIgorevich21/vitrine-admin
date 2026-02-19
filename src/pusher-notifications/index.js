import Pusher from "pusher-js";
import { useAuth } from "../stores/authStore";
import { notify } from "@kyvg/vue3-notification";
import router from "@/router";
import { syncConfigs } from "@/stores/syncConfigs";

const apiUrl = import.meta.env.VITE_APP_API_URL;
const value = `; ${document.cookie}`;
const parts = value.split(`; XSRF-TOKEN=`);
const xsrfToken = parts.pop().split(";").shift();

const pusher = new Pusher(import.meta.env.VITE_APP_PUSHER_APP_KEY, {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app_id: import.meta.env.VITE_APP_PUSHER_APP_ID,
  key: import.meta.env.VITE_APP_PUSHER_APP_KEY,
  secret: import.meta.env.VITE_APP_PUSHER_APP_SECRET,
  cluster: import.meta.env.VITE_APP_PUSHER_APP_CLUSTER,
  // authEndpoint: apiUrl + "/broadcasting/auth",
  channelAuthorization: {
    endpoint: apiUrl + "/broadcasting/auth",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "Access-Control-Allow-Credentials": "true",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
    },
  },
});

pusher.subscribe("check-auth");

pusher.bind("App\\Events\\CheckAuthEvent", () => {
  const authStore = useAuth();
  authStore.getAuthUser();
});

if (localStorage.getItem("userId")) {
  var privateChannel = pusher.subscribe(
    "private-App.Models.User." + localStorage.getItem("userId")
  );
  privateChannel.bind(
    "Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
    (notification) => {
      if (notification.type === "App\\Notifications\\TestNotification") {
        notify({
          group: "default",
          type: "success",
          duration: 10000,
          title: "Новая операция",
          text: notification.message,
        });
      }
      if (
        notification.type ===
        "App\\Notifications\\Auth\\CheckDeviceNotification"
      ) {
        const authStore = useAuth();
        authStore.getAuthUser();
      }
      if (notification.type === "App\\Notifications\\CheckNewNotifications") {
        const configStore2 = syncConfigs();
        configStore2.updateConfigs();
      }
    }
  );
}

pusher.subscribe("maintenance");
pusher.bind("App\\Events\\StartMaintenanceNotification", (notification) => {
  const authStore = useAuth();
  const amIExcluded = notification.data.excluded_user_ids.includes(
    parseInt(authStore.identity?.id) ?? parseInt(localStorage.getItem("userId"))
  );
  console.log(router.currentRoute.value.name === "maintenance", amIExcluded);
  if (router.currentRoute.value.name === "maintenance" && amIExcluded) {
    router.push("/");
  }
  if (!amIExcluded) {
    router.go("/maintenance");
  }
});
pusher.bind("App\\Events\\EndMaintenanceNotification", (notification) => {
  const authStore = useAuth();
  const amIExcluded = notification.data?.excluded_user_ids?.includes(
    parseInt(authStore.identity?.id) ?? parseInt(localStorage.getItem("userId"))
  );
  if (!amIExcluded) {
    router.push("/");
  }
});
pusher.bind("App\\Events\\MaintenanceNotification", (notification) => {
  const configStore2 = syncConfigs();
  configStore2.updateConfigs();
  console.log(notification);
});
pusher.subscribe("configs");
pusher.bind("App\\Events\\ConfigsUpdated", async () => {
  const configsStore = syncConfigs();
  await configsStore.updateConfigs();
});
pusher.subscribe("users");
pusher.bind("App\\Events\\UsersUpdated", async () => {
  const authStore = useAuth();
  await authStore.updateUser();
});

export default pusher;

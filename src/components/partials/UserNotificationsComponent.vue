<template>
  <div class="divide-y dark:divide-gray-700 divide-gray-100">
    <div class="py-2 px-4 text-gray-900 dark:text-gray-200">
      <div class="font-bold truncate">Уведомления</div>
    </div>
    <div v-if="notificationResources.length > 0">
      <div
        v-for="(notification, index) in notificationResources"
        :key="notification"
        class="divide-y dark:divide-gray-700 divide-gray-100 text-sm text-gray-900 dark:text-gray-200"
        :class="getNotificationClass(notification)"
      >
        <div class="row py-2 px-4">
          <div class="col-10" v-html="notification.content"></div>
          <div class="col-2">
            <a href="#" @click.prevent="readNotification(notification)">
              <i class="fe fe-eye mr-2" />
            </a>
            <a
              href="#"
              @click.prevent="deleteNotification(notification, index)"
            >
              <i class="fe fe-trash mr-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="py-2 px-4">Нет новых уведомлений</div>
    <div
      v-if="notificationResources.length > 0"
      class="py-2 px-4 text-gray-900 dark:text-gray-200 text-right"
    >
      <button class="text-red-400" @click="deleteAllNotifications">
        Удалить все
      </button>
    </div>
  </div>
</template>

<script>
import * as API from "@/services/API";

export default {
  props: {
    notifications: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      notificationResources: [],
    };
  },
  created() {
    this.notificationResources = this.notifications.filter(
      (item) => item.type !== "maintenance"
    );
  },
  methods: {
    async readNotification(notification) {
      const response = await API.apiClient.post(
        "/notifications/" + notification.id + "/read"
      );

      let newNotifications = response.data.data.notifications;
      this.notificationResources = newNotifications;
    },
    async deleteNotification(notification, index) {
      // if (confirm("Вы действительно хотите удалить операцию?")) {
      await API.apiClient.delete("/notifications/" + notification.id);

      this.notificationResources = this.notificationResources.filter(
        (c, i) => !(i === index)
      );
      // }
    },
    async deleteAllNotifications() {
      if (confirm("Вы действительно хотите удалить все уведомления?")) {
        await API.apiClient.post("/notifications/delete-all-notifications");
        this.notificationResources = [];
      }
    },
    getNotificationClass(notification) {
      let classValue = "";
      if (notification.status === "created") {
        classValue = "bg-red-200 dark:bg-red-400";
      }

      return classValue;
    },
  },
};
</script>

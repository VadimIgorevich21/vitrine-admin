<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  status: string;
}>();

const { t } = useI18n();

const statusClass = computed(() => {
  const s = props.status.toLowerCase();
  switch (s) {
    case "completed":
      return "status-completed";
    case "error":
    case "failed":
    case "rejected":
      return "status-error";
    case "cancelled":
      return "status-cancelled";
    case "pending":
      return "status-pending";
    case "verifying":
      return "status-verifying";
    case "paid":
      return "status-paid";
    case "processing":
      return "status-processing";
    case "expired":
      return "status-expired";
    default:
      return "status-default";
  }
});

const statusText = computed(() => {
  const s = props.status.toLowerCase();
  return t(`orders.statuses.${s}`, s);
});
</script>

<template>
  <span :class="['status-badge', statusClass]">
    {{ statusText }}
  </span>
</template>

<style scoped>
.status-badge {
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

/* Colors based on requirements and common design patterns */
.status-completed {
  background-color: #ecfdf3;
  color: #027a48;
}

.status-error {
  background-color: #fef3f2;
  color: #b42318;
}

.status-cancelled {
  background-color: #f2f4f7;
  color: #667085;
}

.status-pending {
  background-color: #fff9e9;
  color: #b54708;
}

.status-verifying {
  background-color: #eff6ff;
  color: #175cd3;
}

.status-paid {
  background-color: #f0f9ff;
  color: #026aa2;
}

.status-processing {
  background-color: #fff9e9;
  color: #b54708;
}

.status-expired {
  background-color: #f9fafb;
  color: #475467;
}

.status-default {
  background-color: #f2f4f7;
  color: #344054;
}
</style>

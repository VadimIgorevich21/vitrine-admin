<template>
  <span class="whitespace-nowrap text-center">
    <span
      v-if="order.status === 'completed'"
      class="status-badge status-completed bg-blue-700 rounded-md text-xs py-1 px-4 text-white text-xs"
      >Выполнен</span
    >
    <span
      v-else-if="order.status === 'pending'"
      class="status-badge status-pending bg-green-700 rounded-md py-1 px-4 text-white text-xs"
      >Ожидание оплаты</span
    >
    <span
      v-else-if="order.status === 'verifying'"
      class="status-badge status-verifying bg-yellow-200 rounded-md py-1 px-4 text-yellow-700 text-xs"
      >Проверка оплаты</span
    >
    <span
      v-else-if="order.status === 'paid'"
      class="status-badge status-paid bg-yellow-200 rounded-md py-1 px-4 text-yellow-700 text-xs"
      >Оплачен</span
    >
    <span
      v-else-if="order.status === 'processing'"
      class="status-badge status-processing bg-yellow-200 rounded-md py-1 px-4 text-yellow-700 text-xs"
      >В обработке</span
    >

    <span
      v-else-if="order.status === 'expired'"
      class="status-badge status-expired bg-yellow-200 rounded-md py-1 px-4 text-yellow-700 text-xs"
      >Просрочен</span
    >

    <span
      v-else-if="order.status === 'error'"
      class="status-badge status-error bg-yellow-200 rounded-md py-1 px-4 text-yellow-700 text-xs"
      >Ошибка платежа</span
    >
    <span
      v-else-if="order.status === 'cancelled'"
      class="status-badge status-cancelled bg-red-700 rounded-md py-1 px-4 text-white text-xs"
      >Отменен (после оплаты)</span
    >
  </span>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: function () {
        return {
          status: null,
        };
      },
    },
  },
};
</script>

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
  background-color: #027a48;
  color: #ffffff;
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

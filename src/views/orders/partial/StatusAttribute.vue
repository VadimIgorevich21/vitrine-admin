<template>
  <div class="flex justify-center">
    <span
      class="status-badge"
      :class="{
        'status-completed': order.status === 'completed',
        'status-pending':
          order.status === 'pending' || order.status === 'processing',
        'status-error': order.status === 'error' || order.status === 'expired',
        'status-verifying': order.status === 'verifying',
        'status-paid': order.status === 'paid',
        'status-cancelled': order.status === 'cancelled',
      }"
    >
      <template v-if="order.status === 'completed'">Выполнен</template>
      <template v-else-if="order.status === 'pending'"
        >Ожидание оплаты</template
      >
      <template v-else-if="order.status === 'verifying'"
        >Проверка оплаты</template
      >
      <template v-else-if="order.status === 'paid'">Оплачен</template>
      <template v-else-if="order.status === 'processing'">В обработке</template>
      <template v-else-if="order.status === 'expired'">Просрочен</template>
      <template v-else-if="order.status === 'error'">Ошибка платежа</template>
      <template v-else-if="order.status === 'cancelled'">Отменен</template>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default: () => ({ status: null }),
    },
  },
};
</script>

<style scoped>
/* Scoped styles are now minimized as we use global custom.css for base badge styling */
.status-verifying {
  @apply bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20 !important;
}
.status-verifying::before {
  @apply bg-sky-500 animate-pulse;
}

.status-paid {
  @apply bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20 !important;
}
.status-paid::before {
  @apply bg-indigo-500;
}

.status-cancelled {
  @apply bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-700/50 !important;
}
.status-cancelled::before {
  @apply bg-slate-400;
}
</style>

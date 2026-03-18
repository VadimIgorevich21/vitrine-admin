<template>
  <div class="flex justify-center">
    <span
      class="status-badge"
      :class="{
        'status-completed': user.kyc_status === 'completed',
        'status-pending': user.kyc_status === 'pending',
        'status-error': user.kyc_status === 'rejected',
        'status-not-started': user.kyc_status === 'not_started',
      }"
    >
      <template v-if="user.kyc_status === 'not_started'">Not Started</template>
      <template v-else-if="user.kyc_status === 'completed'">Completed</template>
      <template v-else-if="user.kyc_status === 'rejected'">Rejected</template>
      <template v-else-if="user.kyc_status === 'pending'">Pending</template>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: function () {
        return {
          kyc_status: null,
        };
      },
    },
  },
};
</script>

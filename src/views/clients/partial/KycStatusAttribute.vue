<template>
  <span class="whitespace-nowrap text-center">
    <span
      v-if="user.kyc_status === 'not_started'"
      class="bg-blue-700 rounded-md text-xs py-1 px-4 text-white text-xs"
      >Not Started</span
    >
    <span
      v-else-if="user.kyc_status === 'completed'"
      class="bg-green-700 rounded-md py-1 px-4 text-white text-xs"
      >Completed</span
    >
    <span
      v-else-if="user.kyc_status === 'rejected'"
      class="bg-red-700 rounded-md py-1 px-4 text-white text-xs"
      >Rejected</span
    >
    <span
      v-else-if="user.kyc_status === 'pending'"
      class="bg-yellow-200 rounded-md py-1 px-4 text-yellow-700 text-xs"
      >Pending</span
    >
  </span>
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

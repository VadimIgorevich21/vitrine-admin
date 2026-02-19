<template>
  <div class="flex justify-start items-center">
    <vip-icon
      v-if="slotProps.option.type === 'counterparty'"
      :is-vip="slotProps.option.is_vip"
      class="mr-2"
    />
    <span>{{ slotProps.option[field] }}</span>
  </div>
</template>

<script>
import VipIcon from "@/components/customers/VipIcon.vue";

export default {
  components: { VipIcon },
  props: {
    slotProps: {
      type: Object,
      default: null,
    },
    field: {
      type: String,
      default: "fullName",
    },
  },
};
</script>

<style></style>

<template>
  <button
    :type="buttonType"
    class="btn-primary flex items-center justify-center gap-2 group relative overflow-hidden active:scale-95 transition-all text-nowrap"
  >
    <slot />
    <Icon v-if="submitting" icon="svg-spinners:ring-resize" class="w-5 h-5" />
  </button>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  components: { Icon },
  props: {
    submitting: {
      type: Boolean,
      default: true,
    },
    buttonType: {
      type: String,
      default: "submit",
    },
  },
};
</script>

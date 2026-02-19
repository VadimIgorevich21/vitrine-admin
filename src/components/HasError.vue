<template>
  <span
    v-if="text"
    :class="noInput ? 'text-danger font-size-sm' : 'invalid-feedback'"
    role="alert"
  >
    {{ text }}
  </span>
</template>

<script>
import { isArray } from "lodash";

export default {
  props: {
    message: {
      type: [Array, String],
      default: "",
    },
    noInput: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    text() {
      return isArray(this.message) ? this.message[0] : this.message;
    },
  },
};
</script>

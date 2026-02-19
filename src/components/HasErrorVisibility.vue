<template>
  <div class="error-body">
    <Transition>
      <span
        v-if="text"
        :class="noInput ? 'text-danger font-size-sm' : 'invalid-data-feedback'"
        role="alert"
      >
        {{ text }}
      </span>
    </Transition>
  </div>
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

<style>
.error-body {
  margin-top: 0.25rem;
  min-height: 20px;
}

.invalid-data-feedback {
  //visibility: hidden;
  //display: none;
  display: block;
  width: 100%;
  font-size: 0.8125rem;
  color: #e63757;
}

.is-invalid ~ .error-body .invalid-data-feedback,
.is-invalid ~ .error-body .invalid-tooltip,
.was-validated :invalid ~ .error-body .invalid-data-feedback,
.was-validated :invalid ~ .error-body .invalid-tooltip {
  display: block;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="list-group list-group-flush">
    <div v-for="account in options" :key="account" class="list-group-item">
      <div class="custom-control custom-radio">
        <input
          :id="'radioAccount' + componentId + account.id"
          v-model="selectedAccount"
          type="radio"
          :value="account.id"
          :disabled="disabled.includes(account.id)"
          class="custom-control-input"
          @change="onChangeSelectedAccount"
        />
        <label
          class="custom-control-label text-gray-900 dark:text-gray-200"
          :for="'radioAccount' + componentId + account.id"
        >
          {{ account.currency.title }}
          <small v-if="showBalance" class="d-block text-muted">
            {{ $filters.formatNumber(account.balance) }}
            {{ account.currency.code }}
          </small>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: function () {
        return [];
      },
    },

    disabled: {
      type: Array,
      default: function () {
        return [];
      },
    },

    value: {
      type: Object,
      default: null,
    },
    showBalance: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["input", "update:modelValue"],

  data: () => ({
    selectedAccount: null,
  }),

  computed: {
    componentId() {
      return this._.uid;
    },
  },

  watch: {
    value: {
      immediate: true,
      handler: function (value) {
        this.selectedAccount = value ? value.id : null;
      },
    },

    disabled(disabled) {
      // deselect account
      if (
        this.selectedAccount !== null &&
        disabled.includes(this.selectedAccount)
      ) {
        this.selectedAccount = null;
      }
    },
  },
  methods: {
    onChangeSelectedAccount() {
      const account = this.options.find((a) => a.id === this.selectedAccount);
      this.$emit("update:modelValue", account);
      this.$emit("input", account);
    },
  },
};
</script>

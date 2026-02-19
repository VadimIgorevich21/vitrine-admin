<template>
  <div
    ref="select"
    tabindex="2"
    class="flex justify-center custom-select-block dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400"
  >
    <div class="h-full">
      <div class="dropdown relative h-full">
        <button
          id="dropdownMenuButton2"
          class="dropdown-toggle disabled:bg-gray-300 disabled:dark:bg-gray-500 h-full px-6 overflow-hidden dark:bg-gray-800 w-full block rounded-md text-gray-500 dark:text-gray-400 transition duration-150 ease-in-out flex items-center whitespace-nowrap show"
          type="button"
          :disabled="disableOnLoading && loading"
          @click.prevent="toggleDropdown"
        >
          {{ selectedCustomer ? selectedCustomer.fullName : placeholder }}
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="caret-down"
            class="w-2 ml-2"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path
              fill="currentColor"
              d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
            ></path>
          </svg>
        </button>
        <ul
          ref="scroll"
          tabindex="2"
          class="dropdown-menu absolute hidden bg-white dark:bg-gray-700 text-base z-50 float-left w-full px-3 py-3 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none"
          aria-labelledby="dropdownMenuButton2"
          :class="{ 'hidden-menu': !isOpen }"
          style="
            overflow: hidden;
            outline: none;
            position: absolute;
            inset: 0px auto auto 0px;
            margin: 0px;
            transform: translate(0px, 29px);
          "
        >
          <li>
            <form class="mb-2">
              <div class="input-group input-group-merge input-group-sm">
                <!-- Input -->
                <input
                  ref="searchInput"
                  v-model="query"
                  type="search"
                  class="form-control form-control-prepended list-search dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border block rounded-md text-gray-500 dark:text-gray-400 focus:border-blue-500 dark:focus:border-blue-500"
                  placeholder="Поиск"
                />

                <!-- Prepend -->
                <div class="input-group-prepend">
                  <div
                    class="input-group-text bg-gray-100 dark:bg-gray-500 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-300 focus:border-blue-500"
                  >
                    <span class="fe fe-search" />
                  </div>
                </div>
              </div>
            </form>
          </li>
          <li v-for="customer in filteredCustomers" :key="customer">
            <button
              :class="{
                active: selectedCustomer && selectedCustomer.id === customer.id,
              }"
              class="dropdown-item text-sm py-2 px-4 font-normal block w-full bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              @click.prevent="selectedCustomer = customer"
              @click="toggleDropdown"
            >
              {{ customer.fullName }}
            </button>
          </li>
        </ul>
        <svg
          v-if="selectedCustomer && cleanable"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          class="dp__icon dp__clear_icon dp__input_icons"
          @click="() => (selectedCustomer = null)"
        >
          <path
            d="M23.057 7.057l-16 16c-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0l16-16c0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0z"
          ></path>
          <path
            d="M7.057 8.943l16 16c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885l-16-16c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885z"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import Customer from "../../models/Customer";
import Scrollbar from "smooth-scrollbar";
import CustomerService from "@/services/CustomerService";

export default {
  props: {
    value: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: "none",
    },
    inactive: {
      type: Number,
      default: null,
    },
    excludeByCurrency: {
      type: String,
      default: null,
    },
    cleanable: {
      type: Boolean,
      default: false,
    },
    relatedCustomers: {
      type: Array,
      default: null,
    },
    hasRelatedCustomers: {
      type: Boolean,
      default: false,
    },
    disableOnLoading: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["input", "wasLoaded"],

  data: () => ({
    loading: false,
    query: "",
    selectedCustomer: null,
    customers: [],

    isOpen: false,
  }),

  computed: {
    filteredCustomers() {
      if (!this.hasRelatedCustomers) {
        return this.customers.filter((c) =>
          c.fullName.toLowerCase().includes(this.query.toLowerCase())
        );
      } else {
        return this.customers.filter(
          (c) =>
            c.fullName.toLowerCase().includes(this.query.toLowerCase()) &&
            (!this.hasRelatedCustomers ||
              this.relatedCustomers?.map((rc) => rc.id).includes(c.id))
        );
      }
    },
  },

  watch: {
    value: {
      immediate: true,
      handler: async function (value) {
        if (value && !(value instanceof Customer)) {
          value = new Customer(value);
        }
        this.selectedCustomer = value;
      },
    },

    async type() {
      await this.getCustomers();
    },

    selectedCustomer(customer) {
      this.$emit("input", customer);
    },
  },

  created() {
    this.getCustomers();
  },
  mounted() {
    Scrollbar.init(this.$refs.scroll);
    document.addEventListener("click", this.clickAway);
  },
  methods: {
    async getCustomers() {
      this.loading = true;

      const response = await CustomerService.getOptimizedCustomers({
        params: {
          type: this.type ? this.type : "none",
          page: "-1",
        },
      });

      this.customers = response.data.data.map((c) => new Customer(c));
      this.$emit("wasLoaded", this.customers);
      this.loading = false;
    },

    isDisabled(customer) {
      if (this.inactive) {
        return customer.id === this.inactive;
      }
      if (!this.excludeByCurrency) {
        return false;
      }

      return !customer.accounts.some(
        (a) => a.currency_code === this.excludeByCurrency
      );
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    clickAway(e) {
      if (!e.composedPath().includes(this.$refs.select)) this.isOpen = false;
    },
  },
};
</script>

<style type="text/scss" scoped>
.dropdown-menu {
  max-height: 350px;
  overflow-y: auto;
  z-index: 500000;
}
.hidden-menu {
  display: none !important;
}
</style>

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
          class="dropdown-toggle disabled:bg-[#fafafa] disabled:dark:bg-gray-500 h-full px-6 overflow-hidden dark:bg-gray-800 w-full block rounded-md dark:text-gray-400 transition duration-150 ease-in-out flex items-center whitespace-nowrap show justify-between"
          type="button"
          :disabled="(disableOnLoading && loading) || disabled"
          @click.prevent="toggleDropdown"
        >
          <template v-if="onlyShortName">
            <div class="flex justify-start items-center">
              <vip-icon
                v-if="withVipIcon && selectedCustomer"
                :is-vip="selectedCustomer.is_vip"
                class="mr-2 ml-0"
              />
              {{
                selectedCustomer
                  ? selectedCustomer.short_name ?? selectedCustomer.name
                  : placeholder
              }}
            </div>
          </template>
          <template v-else>
            {{ selectedCustomer ? selectedCustomer.fullName : placeholder }}
          </template>
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
              :class="[
                {
                  active:
                    selectedCustomer && selectedCustomer.id === customer.id,
                },
                itemClass ?? null,
              ]"
              class="dropdown-item text-sm py-2 px-4 font-normal block w-full bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:bg-[#41b883]"
              @click.prevent="() => onClickItem(customer)"
              @click="toggleDropdown"
            >
              <template v-if="onlyShortName">
                <div class="flex justify-start items-center">
                  <vip-icon
                    v-if="withVipIcon"
                    :is-vip="customer.is_vip"
                    class="mr-2 ml-0"
                  />
                  <template
                    v-if="
                      ['counterparty', 'newexpense'].includes(customer.type)
                    "
                  >
                    {{ customer.short_name ?? customer.name }}
                  </template>
                  <template v-else>
                    {{ customer.short_name ?? customer.name }}
                  </template>
                </div>
              </template>
              <template v-else>
                {{ customer.fullName }}
              </template>
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
          @click="() => onClickItem(null)"
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
<!--<template>-->
<!--    <select class="custom-select" v-model="selectedCustomer" :disabled="loading">-->
<!--        <option value="" />-->
<!--        <option v-for="foundCustomer in customers"-->
<!--                :key="'account-' + foundCustomer.id"-->
<!--                :value="foundCustomer.id"-->
<!--                :disabled="isDisabled(foundCustomer)">-->
<!--            {{ foundCustomer.fullName }}-->
<!--        </option>-->
<!--    </select>-->
<!--</template>-->

<script>
import Customer from "../../models/Customer";
import Scrollbar from "smooth-scrollbar";
import CustomerService from "@/services/CustomerService";
import VipIcon from "@/components/customers/VipIcon.vue";

export default {
  components: { VipIcon },
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
    ownMode: {
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
    cashBranch: {
      type: Object,
      default: null,
    },
    excludeCustomers: {
      type: Array,
      default: () => [],
    },
    disableOnLoading: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    onlyShortName: {
      type: Boolean,
      default: false,
    },
    itemClass: {
      type: String,
      default: "text-center",
    },
    withVipIcon: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      if (this.cashBranch) {
        return this.customers.filter(
          (c) =>
            c.fullName.toLowerCase().includes(this.query.toLowerCase()) &&
            c.cash_branch_id === this.cashBranch.id &&
            !this.excludeCustomers.includes(c.id)
        );
      }
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
    // isOpen(value) {
    //   var element = document.getElementById("body-scroll");
    //   var htmlSelector = document.querySelector("html");
    //   if (value === true) {
    //     const scrollbar = Scrollbar.init(
    //       document.querySelector("#body-scroll")
    //     );
    //     scrollbar.destroy();
    //     element.classList.add("overflow-hidden");
    //     htmlSelector.classList.add("overflow-hidden");
    //   } else {
    //     htmlSelector.classList.remove("overflow-hidden");
    //     element.classList.remove("overflow-hidden");
    //     const scrollbar = Scrollbar.init(
    //       document.querySelector("#body-scroll")
    //     );
    //   }
    // },
  },

  created() {
    this.getCustomers();
  },
  mounted() {
    Scrollbar.init(this.$refs.scroll);
    // document.addEventListener("click", this.clickAway, false);
    document.addEventListener("pointerdown", this.clickAway, false);
  },
  methods: {
    async getCustomers() {
      this.loading = true;

      const response = await CustomerService.getOptimizedCustomers({
        params: {
          type: this.type ? this.type : "none",
          ownMode: this.ownMode === true ? this.ownMode : null,
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
    onClickItem(customer) {
      this.$emit("input", customer);
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

.dropdown-item:hover {
  background: #f3f3f3;
  color: #35495e;
}

.dropdown-item.active {
  background: #f3f3f3;
  color: #35495e;
  font-weight: 700;
}

.dropdown-toggle {
  min-height: 40px;
}

.dropdown-toggle svg {
  margin-left: auto;
}

.is-invalid .dropdown-toggle {
  border: 1px solid #e63757;
}
</style>

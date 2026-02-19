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
          class="dropdown-toggle h-full px-6 overflow-hidden dark:bg-gray-800 w-full block rounded-md text-gray-500 dark:text-gray-400 transition duration-150 ease-in-out flex items-center whitespace-nowrap show justify-between"
          type="button"
          @click.prevent="toggleDropdown"
        >
          <template v-if="hasValues">{{ selectedValuesStr }}</template>
          <template v-else>{{ placeholder }}</template>
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
          class="dropdown-menu absolute bg-white dark:bg-gray-700 text-base z-50 float-left w-full px-3 py-3 list-none text-left rounded-lg shadow-lg mt-1 m-0 bg-clip-padding border-none"
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
          <li v-for="option in filteredOptions" :key="option">
            <button
              :class="[
                {
                  active: isItemSelected(option),
                },
                itemClass ?? null,
              ]"
              class="dropdown-item text-sm py-2 px-4 font-normal block w-full bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:bg-gray-800"
              @click.prevent="() => onClickItem(option)"
            >
              {{ option[labelName] }}
            </button>
          </li>
        </ul>
        <svg
          v-if="selectedValue && cleanable"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          class="dp__icon dp__clear_icon dp__input_icons"
          @click="() => onClickClear()"
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
import Scrollbar from "smooth-scrollbar";

export default {
  props: {
    modelValue: {
      type: Object,
      default: null,
    },
    options: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    keyName: {
      type: String,
      default: "key",
    },
    labelName: {
      type: String,
      default: "label",
    },
    type: {
      type: String,
      default: "none",
    },
    cleanable: {
      type: Boolean,
      default: false,
    },
    emptyOptions: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    itemClass: {
      type: String,
      default: "text-center",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["input", "wasLoaded", "update:modelValue"],

  data: () => ({
    loading: false,
    query: "",
    selectedValue: null,
    selectedValues: [],
    users: [],

    isOpen: false,
  }),

  computed: {
    hasValues() {
      return this.multiple
        ? this.selectedValues?.length > 0
        : !!this.selectedValue;
    },
    selectedValuesStr() {
      if (this.multiple) {
        return this.selectedValues
          .map((item) => (this.labelName ? item[this.labelName] : item))
          .join(", ");
      } else {
        return this.labelName
          ? this.selectedValue[this.labelName]
          : this.selectedValue;
      }
    },
    filteredOptions() {
      return this.options.filter((c) =>
        c[this.labelName].toLowerCase().includes(this.query.toLowerCase())
      );
    },
  },

  watch: {
    modelValue: {
      immediate: true,
      handler: async function (value) {
        if (this.multiple) {
          this.selectedValues = value;
        } else {
          this.selectedValue = value;
        }
      },
    },

    options() {
      if (this.multiple) {
        this.selectedValues = this.modelValue;
      } else {
        this.selectedValue = this.modelValue;
      }
    },
  },
  mounted() {
    Scrollbar.init(this.$refs.scroll);
    document.addEventListener("pointerdown", this.clickAway, false);
  },
  methods: {
    onClickItem(value) {
      if (this.multiple) {
        if (this.isItemSelected(value)) {
          this.selectedValues = this.selectedValues.filter((item) =>
            this.keyName
              ? item[this.keyName] !== value[this.keyName]
              : item !== value
          );
        } else {
          this.selectedValues.push(value);
        }
        this.$emit("update:modelValue", this.selectedValues);
      } else {
        this.selectedValue = value;
        this.$emit("update:modelValue", value);
      }
      if (!this.multiple) {
        this.isOpen = false;
      }
    },
    onClickClear() {
      this.selectedValue = null;
      this.selectedValues = [];
      this.$emit("update:modelValue", null);
    },
    toggleDropdown() {
      if (!this.disabled) {
        this.isOpen = !this.isOpen;
      }
    },
    clickAway(e) {
      if (!e.composedPath().includes(this.$refs.select)) this.isOpen = false;
    },
    isItemSelected(value) {
      if (this.keyName) {
        return !!this.selectedValues.find(
          (item) => item[this.keyName] === value[this.keyName]
        );
      } else {
        return !!this.selectedValues.find((item) => item === value);
      }
    },
  },
};
</script>

<style type="text/scss" scoped>
.dropdown-menu {
  max-height: 250px;
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
</style>

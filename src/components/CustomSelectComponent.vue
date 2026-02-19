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
          :class="disabled ? 'cursor-not-allowed bg-[#fafafa]' : ''"
          type="button"
          @click.prevent="toggleDropdown"
        >
          {{ selectedValue ? selectedValue[labelName] : placeholder }}
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="caret-down"
            class="w-2 ml-2"
            :class="{ 'transform-z-rotate-180': isOpen }"
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
            transform: translate(0px, 40px);
          "
        >
          <li v-if="searchable">
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
                  active:
                    selectedValue && selectedValue[keyName] === option[keyName],
                },
                itemClass ?? null,
              ]"
              class="dropdown-item text-sm py-2 px-4 font-normal block w-full bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 hover:bg-gray-800"
              @click.prevent="() => onClickItem(option)"
              @click="toggleDropdown"
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
          class="drop_value_icon clear_value_icon custome_select_input_icons"
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
      type: [Object, String],
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
    searchable: {
      type: Boolean,
      default: true,
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
  },
  emits: ["input", "wasLoaded", "update:modelValue"],

  data: () => ({
    loading: false,
    query: "",
    selectedValue: null,
    users: [],

    isOpen: false,
  }),

  computed: {
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
        if (this.keyName) {
          this.selectedValue = this.options.find(
            (item) => item[this.keyName] === value
          );
        } else {
          this.selectedValue = value;
        }
      },
    },

    options() {
      if (this.keyName) {
        this.selectedValue = this.options.find(
          (item) => item[this.keyName] === this.modelValue
        );
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
      this.selectedValue = value;
      this.$emit("update:modelValue", value ? value[this.keyName] : null);
    },
    onClickClear() {
      if (!this.disabled) {
        this.selectedValue = null;
        this.$emit("update:modelValue", null);
      }
    },
    toggleDropdown() {
      if (!this.disabled) {
        this.isOpen = !this.isOpen;
      }
    },
    clickAway(e) {
      if (!e.composedPath().includes(this.$refs.select)) this.isOpen = false;
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

.drop_value_icon {
  stroke: currentcolor;
  fill: currentcolor;
}

.clear_value_icon {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--dp-icon-color);
}

.custome_select_input_icons {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  stroke-width: 0;
  font-size: 1rem;
  line-height: calc(1rem * 1.5);
  //padding: 6px 12px;
  margin: 0 12px;
  color: var(--dp-icon-color);
  box-sizing: content-box;
}

.dropdown-toggle {
  min-height: 40px;
}

.dropdown-toggle svg {
  margin-left: auto;
  transition: transform 0.2s ease;
}

.is-invalid .dropdown-toggle {
  border: 1px solid #e63757;
}

.spacey-select .dropdown-toggle {
  padding-right: 5px;
  padding-left: 5px;
}

.spacey-select .dropdown-menu {
  padding-right: 0;
  padding-left: 0;
  padding-bottom: 0;
}

.transform-z-rotate-180 {
  transform: rotateZ(180deg);
}
</style>

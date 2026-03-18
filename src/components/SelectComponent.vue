<template>
  <div
    ref="select"
    tabindex="2"
    class="relative w-full group transition-all duration-200"
    :class="{ 'opacity-60 cursor-not-allowed': disabled }"
  >
    <button
      id="dropdownMenuButton2"
      type="button"
      class="w-full flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm text-sm text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none"
      :disabled="disabled"
      @click.prevent="toggleDropdown"
    >
      <span class="truncate font-medium">
        <template v-if="hasValues">{{ selectedValuesStr }}</template>
        <template v-else>{{ placeholder }}</template>
      </span>
      <Icon
        icon="heroicons:chevron-down"
        class="w-4 h-4 ml-2 text-slate-400 dark:text-slate-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-[100] mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden py-2 transition-all"
    >
      <div
        class="px-3 pb-2 mb-2 border-b border-slate-100 dark:border-slate-700/50"
      >
        <div class="relative group">
          <Icon
            icon="heroicons:magnifying-glass"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
          />
          <input
            ref="searchInput"
            v-model="query"
            type="search"
            class="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            placeholder="Поиск..."
          />
        </div>
      </div>

      <div ref="scroll" class="max-h-60 overflow-y-auto custom-scrollbar">
        <ul class="list-none p-0 m-0">
          <li v-for="option in filteredOptions" :key="option">
            <button
              class="w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between"
              :class="[
                isItemSelected(option)
                  ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              ]"
              @click.prevent="() => onClickItem(option)"
            >
              <span>{{ option[labelName] }}</span>
              <Icon
                v-if="isItemSelected(option)"
                icon="heroicons:check"
                class="w-4 h-4"
              />
            </button>
          </li>
          <li
            v-if="filteredOptions.length === 0"
            class="px-4 py-6 text-center text-slate-400 text-xs italic"
          >
            Ничего не найдено
          </li>
        </ul>
      </div>

      <div
        v-if="selectedValue && cleanable"
        class="px-3 pt-2 mt-2 border-t border-slate-100 dark:border-slate-700/50 text-center"
      >
        <button
          class="text-xs text-red-500 hover:text-red-600 font-medium py-1 px-3 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          @click="onClickClear"
        >
          Очистить выбор
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Scrollbar from "smooth-scrollbar";
import { Icon } from "@iconify/vue";

export default {
  components: { Icon },
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

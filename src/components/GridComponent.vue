<template>
  <div
    class="mt-4 bg-white dark:bg-slate-800 w-full rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700/50 overflow-hidden transition-all duration-300"
  >
    <div
      v-if="!!$slots['header']"
      class="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50"
    >
      <slot name="header" />
    </div>

    <perfect-scrollbar class="max-h-[calc(100vh-300px)]">
      <div class="overflow-x-auto">
        <table
          class="w-full text-sm text-left text-slate-600 dark:text-slate-400"
        >
          <thead
            class="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700"
          >
            <tr>
              <th
                v-for="header in headers"
                :key="header.value"
                scope="col"
                class="px-6 py-4 font-semibold"
                :class="header.class"
              >
                <button
                  v-if="header.sortable"
                  class="flex items-center gap-1 hover:text-indigo-600 transition-colors uppercase"
                  @click.prevent="sortByColumn(header.value)"
                >
                  {{ header.text }}
                  <span
                    v-if="header.value === sortedColumn"
                    class="ml-1 text-indigo-500"
                  >
                    <Icon
                      :icon="
                        direction === 'asc'
                          ? 'heroicons:chevron-up'
                          : 'heroicons:chevron-down'
                      "
                      class="w-3.5 h-3.5"
                    />
                  </span>
                </button>
                <span v-else>{{ header.text }}</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
            <tr
              v-for="(item, idx) in items"
              :key="item.id || idx"
              class="group hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
              @click="() => $emit('click-item', item)"
            >
              <td
                v-for="header in headers"
                :key="header.value"
                class="px-6 py-4 transition-all"
                :class="header.class"
                :width="header.width"
                @click.stop="edit(item, header)"
              >
                <slot :name="'item-' + header.value" :item="item">
                  <span class="font-medium text-slate-700 dark:text-slate-300">
                    {{ item[header.value] ?? "—" }}
                  </span>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </perfect-scrollbar>

    <div
      v-if="loading"
      class="p-8 flex justify-center border-t border-slate-100 dark:border-slate-700"
    >
      <loading-component :enabled="loading" />
    </div>

    <div
      v-if="!loading && items.length === 0"
      class="p-12 text-center text-slate-400 dark:text-slate-500 italic"
    >
      <Icon icon="heroicons:inbox" class="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p>{{ messageForEmptyTable || "Нет данных для отображения" }}</p>
    </div>

    <div
      v-if="!loading && items.length > 0"
      class="px-6 py-4 border-t border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50"
    >
      <pagination-component :per-page="perPage" :total="itemsTotal" />
    </div>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import PaginationComponent from "./PaginationComponent.vue";
import { Icon } from "@iconify/vue";

export default {
  name: "GridComponent",
  components: { LoadingComponent, PaginationComponent, Icon },
  props: {
    items: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    headers: {
      type: Array,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    messageForEmptyTable: {
      type: String,
      default: "",
    },
    resourceUrl: {
      type: String,
      default: "operations",
    },
    perPage: {
      type: Number,
      default: null,
    },
    itemsTotal: {
      type: Number,
      default: null,
    },
    customEditFunction: {
      type: Function,
      default: null,
    },
  },
  emits: ["sorted", "click-item"],
  data: () => ({
    sortedColumn: null,
    direction: "asc",
  }),
  methods: {
    async edit(resource, header) {
      if (header.value === "actions" || header?.custom_link === true) return;
      // this.customEditFunction(resource);
      if (this.customEditFunction) {
        this.customEditFunction(resource);
        return;
      }
      if (resource.actions.includes("update")) {
        await this.$router.push({
          name: this.resourceUrl + ".edit",
          params: { id: resource.id },
        });
      } else if (resource.actions.includes("view")) {
        await this.$router.push({
          name: this.resourceUrl + ".show",
          params: { id: resource.id },
        });
      }
    },
    sortByColumn(column) {
      if (column === this.sortedColumn) {
        this.direction = this.direction === "asc" ? "desc" : "asc";
      } else {
        this.sortedColumn = column;
        this.direction = "asc";
      }
      this.$emit("sorted", this.sortedColumn, this.direction);
    },
  },
};
</script>

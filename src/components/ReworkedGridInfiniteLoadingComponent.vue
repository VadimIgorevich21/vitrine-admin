<template>
  <div
    class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border shadow"
  >
    <div v-if="!!$slots['header']" class="card-header h-auto d-block pb-3">
      <slot name="header" />
    </div>

    <perfect-scrollbar>
      <div class="wrapping-table">
        <div
          v-if="sorting"
          class="absolute inset-0 bg-black opacity-30 flex items-center justify-center"
        />
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400 lg:overflow-auto overflow-x-scroll project-styled-grid-table"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 project-styled-grid-table-thead"
          >
            <tr
              class="project-styled-grid-table-tr"
              :class="headerHidden ? '!hidden' : null"
            >
              <th
                v-for="header in headers"
                :key="header"
                scope="col"
                class="uppercase px-2 py-3 project-styled-grid-table-th"
                :class="header.class"
              >
                <div class="header-right-line">
                  <a
                    v-if="header.sortable"
                    href="#"
                    class="text-blue-600"
                    @click.prevent="sortByColumn(header.value)"
                  >
                    {{ header.text }}
                    <span v-if="header.value === sortedColumn">
                      <i v-if="direction === 'asc'" class="fe fe-arrow-up"></i>
                      <i v-else class="fe fe-arrow-down"></i>
                    </span>
                  </a>
                  <span v-else>{{ header.text }}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody class="project-styled-grid-table-tbody">
            <tr
              v-for="(item, index) in itemValues"
              :key="item"
              class="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 project-styled-grid-table-tr"
              @click="() => $emit('click-item', item)"
            >
              <td
                v-for="header in headers"
                :key="header"
                scope="col"
                class="px-2 py-3 cursor-pointer project-styled-grid-table-td"
                :class="header.class"
                :width="header.width"
                @click="() => edit(item, header)"
              >
                <slot
                  :name="'item-' + header.value"
                  :item="item"
                  :index="index"
                  >{{ item[header.value] ?? "Нет" }}</slot
                >
              </td>
            </tr>
          </tbody>
          <tfoot
            v-if="!loading && itemValues.length !== 0"
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 project-styled-grid-table-tfoot"
          >
            <tr class="project-styled-grid-table-tr">
              <td
                v-for="header in headers"
                :key="header"
                scope="col"
                class="uppercase px-2 py-3 project-styled-grid-table-tfoot-td"
                :class="header.class"
                :width="header.width"
              >
                {{ header.text }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </perfect-scrollbar>
    <loading-component :enabled="loading" />
    <div
      v-if="!loading && itemValues.length === 0"
      class="pt-5 text-gray-700 dark:text-gray-400 card-footer font-size-sm"
    >
      {{ messageForEmptyTable }}
    </div>
  </div>
  <infinite-loading @infinite="$emit('load')">
    <template #spinner>
      <div class="hidden"></div>
    </template>
    <template #complete>
      <span> There is no more operations </span>
    </template>
  </infinite-loading>
</template>

<script>
import LoadingComponent from "@/components/LoadingComponent.vue";
import InfiniteLoading from "v3-infinite-loading";

export default {
  name: "GridComponent",
  components: { InfiniteLoading, LoadingComponent },
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
    headerHidden: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    sorting: {
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
    itemsTotal: {
      type: Number,
      default: null,
    },
    customEditFunction: {
      type: Function,
      default: null,
    },
  },
  emits: ["load", "sorted", "click-item"],
  data: () => ({
    itemValues: [],
    sortedColumn: null,
    direction: "asc",
  }),
  watch: {
    items: function () {
      this.itemValues = this.items;
    },
  },
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

<template>
  <div
    class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border shadow"
  >
    <div v-if="!!$slots['header']" class="card-header h-auto d-block pb-3">
      <slot name="header" />
    </div>

    <perfect-scrollbar>
      <div class="wrapping-table">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400 lg:overflow-auto overflow-x-scroll"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th
                v-for="header in headers"
                :key="header"
                scope="col"
                class="uppercase px-2 py-3"
                :class="header.class"
              >
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
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in items"
              :key="item"
              class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 odd:bg-white even:bg-gray-50"
              @click="() => $emit('click-item', item)"
            >
              <td
                v-for="header in headers"
                :key="header"
                scope="col"
                class="px-2 py-3 cursor-pointer"
                :class="header.class"
                @click="edit(item, header)"
              >
                <slot :name="'item-' + header.value" :item="item">{{
                  item[header.value] ?? "Нет"
                }}</slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </perfect-scrollbar>
    <loading-component :enabled="loading" />
    <div
      v-if="!loading && items.length === 0"
      class="pt-5 text-gray-700 dark:text-gray-400 card-footer font-size-sm"
    >
      {{ messageForEmptyTable }}
    </div>
    <div v-if="!loading && items.length > 0" class="card-footer">
      <pagination-component :per-page="perPage" :total="itemsTotal" />
    </div>
  </div>
</template>

<script>
import LoadingComponent from "./LoadingComponent.vue";
import PaginationComponent from "./PaginationComponent.vue";

export default {
  name: "GridComponent",
  components: { LoadingComponent, PaginationComponent },
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

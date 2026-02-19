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
            <template
              v-for="(item, index) in itemValues"
              :key="generateKey(item)"
            >
              <tr
                class="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 project-styled-grid-table-tr"
                @click="toggleExpand(item)"
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
              <!-- Развернутая строка (открывается для нескольких строк) -->
              <tr v-if="expandedItems[generateKey(item)]">
                <td :colspan="headers.length">
                  <slot
                    name="expanded-content"
                    :item="item"
                    :loading="loadingExpanded[generateKey(item)]"
                    :data="expandedItems[generateKey(item)]"
                  />
                </td>
              </tr>
            </template>
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
</template>

<script>
import LoadingComponent from "@/components/LoadingComponent.vue";

export default {
  name: "GridComponent",
  components: { LoadingComponent },
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
    loadExpandedDataFunction: {
      type: Function,
      default: null,
    },
  },
  emits: ["sorted", "click-item"],
  data: () => ({
    itemValues: [],
    sortedColumn: null,
    direction: "asc",
    expandedItems: {}, // Объект для хранения состояния каждой раскрытой строки
    loadingExpanded: {},
  }),
  watch: {
    items: function () {
      this.itemValues = this.items;
    },
  },
  methods: {
    generateKey(item) {
      return item.id ? `id-${item.id}` : JSON.stringify(item);
    },
    async toggleExpand(item) {
      const key = this.generateKey(item);

      // Если элемент уже открыт, закрываем его
      if (this.expandedItems[key]) {
        this.expandedItems = {}; // Очистка всех раскрытых элементов
        return;
      }

      // Очистка всех других элементов перед открытием нового
      this.expandedItems = {};
      this.loadingExpanded[key] = true;

      try {
        const data = await this.loadExpandedDataFunction(item);
        this.expandedItems[key] = data;
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        this.expandedItems[key] = [];
      } finally {
        this.loadingExpanded[key] = false;
      }
    },
    async toggleExpandMany(item) {
      const key = this.generateKey(item);

      if (this.expandedItems[key]) {
        delete this.expandedItems[key];
        delete this.loadingExpanded[key];
        return;
      }

      this.loadingExpanded[key] = true; // Просто присваивание вместо this.$set()

      try {
        const data = await this.loadExpandedDataFunction(item);
        console.log(data);
        console.log(data);
        console.log(data);
        console.log(data);
        this.expandedItems[key] = data;
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        this.expandedItems[key] = [];
      } finally {
        this.loadingExpanded[key] = false;
      }
    },
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

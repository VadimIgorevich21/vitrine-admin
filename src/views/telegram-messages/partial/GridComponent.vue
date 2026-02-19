<template>
  <div
    class="mt-2 bg-white dark:bg-gray-800 p-5 w-full rounded-md box-border shadow"
  >
    <div
      v-if="!!$slots['header']"
      id="filter"
      ref="header"
      class="card-header h-auto d-block pb-3"
    >
      <slot name="header" />
    </div>

    <div class="wrapping-table min-h-[305px]">
      <table
        class="w-full text-sm text-left text-gray-500 dark:text-gray-400 lg:overflow-auto overflow-x-scroll css-13d9jw5"
      >
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 css-1aj8rkm"
        >
          <tr class="css-1h6bc7l" :class="headerHidden ? '!hidden' : null">
            <th
              v-for="header in headers"
              :key="header"
              scope="col"
              class="uppercase px-2 py-3 css-wx9sbq"
              :style="'width: ' + header.width"
              :class="header.headerClass"
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
        <tbody class="css-1pt5hah">
          <tr
            v-for="(item, index) in itemValues"
            :key="item"
            class="border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 css-1h6bc7l"
            :class="getRowBgClass(item)"
          >
            <td
              v-for="header in headers"
              :key="header"
              scope="col"
              class="px-2 py-3 cursor-pointer css-152wy78"
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
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 css-14vebub"
        >
          <tr class="css-1h6bc7l">
            <td
              v-for="header in headers"
              :key="header"
              scope="col"
              class="uppercase px-2 py-3 css-15tpnfi"
              :class="header.class"
              :width="header.width"
            >
              {{ header.text }}
            </td>
          </tr>
        </tfoot>
      </table>
      <div
        v-if="!loading && itemValues.length === 0"
        class="pt-5 text-gray-700 dark:text-gray-400 card-footer font-size-sm"
      >
        {{ messageForEmptyTable }}
      </div>
    </div>
    <loading-component :enabled="loading" />
  </div>
</template>

<script>
import LoadingComponent from "../../../components/LoadingComponent.vue";

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
    messageForEmptyTable: {
      type: String,
      default: "",
    },
  },
  emits: ["sorted", "hover", "close"],
  data: () => ({
    sortedColumn: null,
    direction: "asc",
    isHovering: false,
    itemValues: [],
  }),
  watch: {
    items: function () {
      this.itemValues = this.items;
    },
  },
  methods: {
    async edit(operation, header) {
      if (header.value === "actions" || header?.custom_link === true) return;
      if (operation.actions.includes("update")) {
        await this.$router.push(operation.updateRoute);
      } else if (operation.actions.includes("view")) {
        await this.$router.push(operation.viewRoute);
      }
    },
    getRowBgClass(item) {
      if (this.isHovering) {
        return "bg-[#e3e3e3]";
      }
      if (item?.calculated_status === 8) {
        return "bg-committed";
      }
      if (item?.calculated_status === 1) {
        return "bg-expired";
      }
      return "bg-white";
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

<style>
.expired {
  background-color: #fcf4db !important;
}
</style>

<style>
.css-13d9jw5 {
  display: table;
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0px;
}
.css-1aj8rkm {
  display: table-header-group;
  background-color: rgb(250, 250, 250);
  border-top: 1px solid rgb(240, 240, 240);
  border-bottom: 2px solid rgb(240, 240, 240);
}

.css-wx9sbq {
  line-height: 1.5rem;
  font-family: "Public Sans", sans-serif;
  display: table-cell;
  vertical-align: inherit;
  border-bottom: 1px solid rgb(240, 240, 240);
  text-align: left;
  color: rgb(38, 38, 38);
  padding: 12px;
  border-top-color: rgb(240, 240, 240);
  border-right-color: rgb(240, 240, 240);
  border-left-color: rgb(240, 240, 240);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.css-wx9sbq.cell-right {
  justify-content: flex-end;
  text-align: right;
}
.css-152wy78 {
  line-height: 1.66;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
  display: table-cell;
  vertical-align: inherit;
  border-bottom: 1px solid rgb(240, 240, 240);
  text-align: left;
  color: rgb(38, 38, 38);
  font-size: 0.875rem;
  padding: 12px;
  border-top-color: rgb(240, 240, 240);
  border-right-color: rgb(240, 240, 240);
  border-left-color: rgb(240, 240, 240);
}

.css-152wy78.cell-right {
  justify-content: flex-end;
  text-align: right;
}

.css-1h6bc7l {
  color: inherit;
  display: table-row;
  vertical-align: middle;
  outline: 0px;
}

.css-1pt5hah {
  display: table-row-group;
}

.css-14vebub {
  display: table-footer-group;
  background-color: rgb(250, 250, 250);
  border-top: 2px solid rgb(240, 240, 240);
  border-bottom: 1px solid rgb(240, 240, 240);
}

.css-15tpnfi {
  line-height: 1.3125rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
  display: table-cell;
  vertical-align: inherit;
  border-bottom: 1px solid rgb(240, 240, 240);
  text-align: left;
  color: rgb(140, 140, 140);
  padding: 12px;
  border-top-color: rgb(240, 240, 240);
  border-right-color: rgb(240, 240, 240);
  border-left-color: rgb(240, 240, 240);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.css-15tpnfi.cell-right {
  justify-content: flex-end;
  text-align: right;
}

.css-wx9sbq {
  padding: 12px 0;
}

.css-152wy78 {
  padding: 3px 6px;
}

.header-right-line {
  padding: 0 6px;
  border-right: 2px solid rgb(240, 240, 240);
}
thead th:nth-last-child(-n + 2) .header-right-line,
thead th:last-child .header-right-line {
  border: none;
}

.bg-committed {
  //background: rgb(192, 192, 192, 0.3);
  background: rgb(245, 245, 245);
}

.bg-expired {
  //background: rgb(252, 240, 218, 0.4);
  background: rgb(253 246 235);
}

.css-1pt5hah tr:hover {
  background: rgba(227, 227, 227, 1);
}
</style>

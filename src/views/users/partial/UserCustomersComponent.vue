<template>
  <div class="form-group row">
    <label
      class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
    >
      {{ headerTitle }}
    </label>
    <div class="col-lg-6">
      <multiselect
        v-if="isNewRecord"
        v-model="selectedItems"
        :options="allItems"
        :multiple="true"
        :placeholder="'Добавьте' + headerTitle"
        label="name"
        track-by="id"
      ></multiselect>
      <template v-else>
        <div class="wrapping-table">
          <table
            v-if="customerType !== 'counterparty'"
            class="w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400 lg:overflow-auto overflow-x-scroll"
          >
            <thead
              class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
            >
              <tr>
                <th
                  scope="col"
                  class="border border-slate-300 uppercase px-6 py-3"
                >
                  {{ headerTableTitle }}
                </th>
                <th
                  scope="col"
                  class="border border-slate-300 uppercase px-6 py-3"
                ></th>
              </tr>
            </thead>
            <tbody>
              <template v-if="issetItems?.length > 0">
                <tr
                  v-for="item in issetItems.filter(
                    (item) => item.type === customerType
                  )"
                  :key="item"
                >
                  <td class="border border-slate-300 px-4 py-2">
                    {{ item.name }}
                  </td>
                  <td class="border border-slate-300 px-4 py-2 text-center">
                    <a
                      href="#"
                      class="js-remove-customer text-danger"
                      @click.prevent="deleteItem(item)"
                    >
                      <i class="fe fe-trash mr-2" />
                    </a>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="2" class="border border-slate-300 px-4 py-2">
                    <strong><em>Записей не найдено</em></strong>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
          <template v-else>
            <div
              v-if="
                issetItems.filter((item) => item.type === customerType).length >
                0
              "
              class="border-collapse border border-slate-400 text-sm text-left flex flex-wrap"
            >
              <div
                v-for="item in issetItems.filter(
                  (item) => item.type === customerType
                )"
                :key="item"
                class="flex items-center border border-slate-300"
              >
                <router-link
                  :to="{
                    name: 'customers.edit',
                    params: { id: item.id },
                  }"
                  class="text-blue-600 p-2"
                >
                  {{ item.name }}
                </router-link>
                <a
                  href="#"
                  class="js-remove-customer text-danger pr-2"
                  @click.prevent="deleteItem(item)"
                >
                  <i class="fe fe-trash" />
                </a>
              </div>
            </div>
            <div
              v-else
              class="border-collapse border border-slate-400 text-sm text-left flex flex-wrap p-2"
            >
              <strong><em>Записей не найдено</em></strong>
            </div>
          </template>
          <div class="text-left" style="float: left">
            <div class="btn-group mt-2">
              <button
                class="btn btn-secondary btn-sm"
                type="button"
                @click="showModal"
              >
                <i v-if="!loading" class="icon-plus2 mr-2" />
                <i v-else class="icon-spinner4 spinner mr-2" />
                Добавить {{ headerTitle }}
              </button>
            </div>
          </div>
          <Modal v-model="isShow" :close="closeModal">
            <div class="modal">
              <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
                <!-- Modal content -->
                <div
                  class="relative bg-white rounded-lg shadow dark:bg-gray-700"
                >
                  <!-- Modal header -->
                  <div
                    class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600"
                  >
                    <h3
                      class="text-xl font-semibold text-gray-900 dark:text-white"
                    >
                      Добавить {{ headerTitle }}
                    </h3>
                    <button
                      type="button"
                      class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-toggle="defaultModal"
                      @click="closeModal"
                    >
                      <svg
                        aria-hidden="true"
                        class="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      <span class="sr-only">Close modal</span>
                    </button>
                  </div>
                  <!-- Modal body -->
                  <div class="p-6 space-y-6">
                    <multiselect
                      v-model="selectedItems"
                      :options="availableItems"
                      :multiple="true"
                      :placeholder="'Добавьте' + headerTitle"
                      label="name"
                      track-by="id"
                    ></multiselect>
                  </div>
                  <!-- Modal footer -->
                  <div
                    class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
                  >
                    <button
                      data-modal-toggle="defaultModal"
                      type="button"
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      @click="addItems"
                    >
                      Добавить
                    </button>
                    <button
                      data-modal-toggle="defaultModal"
                      type="button"
                      class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      @click="closeModal"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
              <button @click="closeModal">close</button>
            </div>
          </Modal>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import CustomerService from "@/services/CustomerService";

export default {
  components: {
    Multiselect,
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: function () {
        return [];
      },
    },
    isNewRecord: {
      type: Boolean,
      required: true,
      default: function () {
        return true;
      },
    },
    customerType: {
      type: String,
      required: true,
      default: function () {
        return null;
      },
    },
  },
  emits: ["itemsAdded"],
  data: () => ({
    loading: false,
    isShow: false,
    allItems: [],
    selectedItems: [],
    issetItems: [],
  }),
  computed: {
    availableItems() {
      return this.allItems.filter(
        (item) => !this.issetItems.map((i) => i.id).includes(item.id)
      );
    },
    headerTitle() {
      if (this.customerType === "cash") {
        return "Кассы";
      }
      if (this.customerType === "counterparty") {
        return "Контрагенты";
      }
      if (this.customerType === "cash_collector") {
        return "Инкаcсаторы";
      }
      if (this.customerType === "wallet") {
        return "Кошельки";
      }
      if (this.customerType === "world_balance") {
        return "Кассы Мир";
      }
      if (this.customerType === "expense") {
        return "Расходы";
      }

      return null;
    },
    headerTableTitle() {
      if (this.customerType === "cash") {
        return "Касса";
      }
      if (this.customerType === "counterparty") {
        return "Контрагент";
      }
      if (this.customerType === "cash_collector") {
        return "Инкаcсатор";
      }
      if (this.customerType === "wallet") {
        return "Кошелек";
      }
      if (this.customerType === "world_balance") {
        return "Касса Мир";
      }
      if (this.customerType === "expense") {
        return "Расходы";
      }

      return null;
    },
  },
  watch: {
    items(items) {
      this.issetItems = items;
    },
    selectedItems(items) {
      if (this.isNewRecord) {
        this.$emit("itemsAdded", [
          ...items,
          ...this.issetItems.filter((item) => item.type !== this.customerType),
        ]);
      }
    },
  },
  async created() {
    await this.getAvailableCustomers();
    this.issetItems = this.items;
  },
  methods: {
    async getAvailableCustomers() {
      try {
        const response = await CustomerService.getUserAvailableCustomers({
          params: {
            user_id: this.userInfo?.id,
            type: this.customerType,
            page: "-1",
          },
        });
        this.allItems = response.data.data;
      } catch (e) {
        if (e.response) {
          if (e.response.status === 404) {
            this.firms = null;
          }
        }
      }
    },
    async deleteItem(item) {
      if (confirm("Вы действительно хотите убрать доступ к данной кассе?")) {
        this.issetItems = this.issetItems.filter((i) => i.id !== item.id);
        this.$emit("itemsAdded", this.issetItems);
      }
    },
    async addItems() {
      if (this.selectedItems.length <= 0) {
        this.isShow = false;
        return;
      }
      this.loading = true;

      this.issetItems = [...this.selectedItems, ...this.issetItems].filter(
        (value, index, array) => array.indexOf(value) === index
      );
      this.selectedItems = [];
      this.$emit("itemsAdded", this.issetItems);

      this.isShow = false;
      this.loading = false;
    },
    showModal() {
      this.isShow = true;
    },
    closeModal() {
      this.isShow = false;
    },
  },
};
</script>
<style src="@/components/reworked-multiselect/vue-multiselect.css"></style>
<style>
.modal {
  max-width: 90%;
}

@media screen and (min-width: 768px) {
  .modal {
    min-width: 500px;
  }
}
</style>

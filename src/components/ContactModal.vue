<template>
  <Modal :model-value="isShow" :close="() => $emit('clickClose')">
    <div class="modal">
      <div class="relative p-4 w-full max-w-5xl h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Связаться с
              {{ operation?.username }}
            </h3>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              @click="() => $emit('clickClose')"
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
          <template v-if="operation">
            <div v-if="!operation?.telegram_contact" class="p-6 space-y-6">
              У данного пользователя не указан логин telegram. Пожалуйста,
              обратитесь к администратору.
            </div>
            <div v-else class="p-6 space-y-6">
              Действительно отправить сообщение {{ operation?.username }}?
            </div>
          </template>
          <!-- Modal footer -->
          <div
            class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
          >
            <button
              v-if="!operation?.telegram_contact"
              data-modal-toggle="defaultModal"
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              @click="() => $emit('clickClose')"
            >
              Ок
            </button>
            <a
              v-else
              data-modal-toggle="defaultModal"
              type="button"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              :href="getTelegramLink(operation)"
              @click="onClickYes"
            >
              Да
            </a>
            <button
              v-if="operation?.telegram_contact"
              data-modal-toggle="defaultModal"
              type="button"
              class="px-5 py-2 rounded border dark:border-gray-600 dark:text-white"
              @click="() => $emit('clickClose')"
            >
              Нет
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { copyText } from "vue3-clipboard";
import { syncConfigs } from "@/stores/syncConfigs";
import Operation from "../models/Operation";

export default {
  name: "ModalWindow",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    operation: {
      type: Object,
      default: null,
    },
    resource: {
      type: Object,
      default: null,
    },
  },
  emits: ["clickOk", "clickClose"],
  setup() {
    const configStore2 = syncConfigs();
    const operations = configStore2.operations;
    return {
      statuses: operations.statuses,
      allOnlyTypes: operations.allOnlyTypes,
      types: operations.types,
      cashboxOperationTypes: operations.cashboxTypes,
      cryptoCurrencyOperationTypes: operations.cryptocurrencyTypes,
      operationTypes: operations.operationTypes,
    };
  },
  methods: {
    getTelegramLink(history) {
      return `tg://resolve?domain=${history.telegram_contact.replace("@", "")}`;
    },
    onClickYes() {
      let message = `№${this.operation.id}\n`;
      message +=
        this.types.find((item) => item.key === this.resource.type).label + "\n";
      message += `Отправитель ${this.resource.sender.id}\n`;
      message += `Получатель ${this.resource.receiver.id}\n`;
      message = `Привет, есть вопрос по операции: №${this.operation.id}\n`;
      const domain =
        window.location.protocol +
        "//" +
        window.location.hostname +
        (window.location.port ? ":" + window.location.port : "");
      let operation = new Operation(this.resource);
      message += domain + this.$router.resolve(operation.viewRoute).href;
      copyText(message, undefined, (error) => {
        console.log(error);
      });
      this.$emit("clickClose");

      // @Sean_Bot md [hello](https://t.me/)

      // Привет, есть вопрос по операции: [номер операции с ссылкой на нее]
    },
  },
};
</script>

<style>
.modal {
  max-width: 90%;
}

@media screen and (min-width: 768px) {
  .modal {
    min-width: 700px;
  }
}

.content-hidden {
  display: none;
}
</style>

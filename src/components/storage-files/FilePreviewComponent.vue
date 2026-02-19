<template>
  <span
    v-if="isImage"
    class="font-bold text-indigo-500 dark:text-indigo-400 cursor-pointer"
    @click="showModal"
  >
    <slot name="image-name">
      {{ imageName }}
    </slot>
  </span>
  <a
    v-else
    :href="file.links.display"
    class="font-bold text-indigo-500 dark:text-indigo-400"
    target="_blank"
  >
    <slot name="image-name">
      {{ imageName }}
    </slot>
  </a>
  <Modal v-model="isShow" :close="closeModal">
    <div class="modal">
      <div class="relative p-4 w-full max-w-2xl h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
              Просмотр
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
            <div v-if="imageUrl" class="image-preview-container">
              <img :src="imageUrl" />
            </div>
            <div v-else>Некоррекный формат или ссылка</div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center justify-end py-3 px-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600"
          >
            <button
              data-modal-toggle="defaultModal"
              type="button"
              class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              @click="closeModal"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
export default {
  props: {
    imageName: {
      type: String,
      default: "Посмотреть",
    },
    imageUrl: {
      type: String,
      default: null,
    },
    file: {
      type: Object,
      default: null,
    },
  },
  data: () => ({
    loading: false,
    isShow: false,
  }),
  computed: {
    isImage() {
      return this.file.mime_type.includes("image");
    },
  },
  methods: {
    showModal() {
      this.isShow = true;
    },
    closeModal() {
      this.isShow = false;
    },
  },
};
</script>

<style>
.modal {
  max-width: 90%;
}

.image-preview-container img {
  max-width: 100%;
  margin: 0 auto;
}

@media screen and (min-width: 768px) {
  .modal {
    min-width: 500px;
  }
}
</style>

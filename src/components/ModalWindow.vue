<template>
  <Modal :model-value="isShow" :close="onClickOutside">
    <div class="modal mx-auto">
      <div class="relative p-0 w-full max-w-5xl h-full md:h-auto">
        <!-- Modal content -->
        <div
          class="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all"
        >
          <!-- Modal header -->
          <div
            class="flex justify-between items-center px-6 py-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800"
          >
            <h3
              class="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              {{ title ?? "Уведомление" }}
            </h3>
            <button
              type="button"
              class="group p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-all"
              :disabled="loading"
              @click="() => $emit('clickClose')"
            >
              <Icon
                icon="heroicons:x-mark"
                class="w-5 h-5 group-hover:scale-110 transition-transform"
              />
              <span class="sr-only">Закрыть</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-6">
            <div
              v-if="content"
              class="text-slate-600 dark:text-slate-300 leading-relaxed"
              v-html="content"
            />
            <div
              v-else
              class="text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              <slot />
            </div>
          </div>
          <!-- Modal footer -->
          <div
            class="flex items-center justify-end px-6 py-4 bg-slate-50/30 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 gap-3"
          >
            <button
              v-if="hasCloseButton"
              type="button"
              class="px-5 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              :disabled="loading"
              @click="() => $emit('clickClose')"
            >
              Отмена
            </button>
            <button
              type="button"
              class="relative flex items-center justify-center min-w-[100px] px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
              :disabled="loading"
              @click="() => $emit('clickOk')"
            >
              <span v-if="!loading">{{ okButtonText }}</span>
              <Icon
                v-else
                icon="heroicons:arrow-path"
                class="w-5 h-5 animate-spin"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "ModalWindow",
  components: { Icon },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: null,
    },
    content: {
      type: String,
      default: null,
    },
    hasCloseButton: {
      type: Boolean,
      default: false,
    },
    okButtonText: {
      type: String,
      default: "Да",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["clickOk", "clickClose"],
  methods: {
    onClickOutside() {
      if (!this.loading) {
        this.$emit("clickClose");
      }
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
    min-width: 500px;
  }
}

.content-hidden {
  display: none;
}
</style>

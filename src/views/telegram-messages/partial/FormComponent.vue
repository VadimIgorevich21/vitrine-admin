<template>
  <div
    class="public-sans-fonts mt-2 bg-white dark:bg-gray-800 pt-10 p-5 w-full rounded-md box-border shadow"
  >
    <div class="flex flex-wrap md:flex-nowrap">
      <div class="w-full md:w-1/2">
        <form @submit.prevent="submit">
          <div class="form-group row !hidden">
            <label
              class="col-lg-12 col-form-label text-gray-900 dark:text-gray-200"
              >Название</label
            >
            <div class="col-lg-12">
              <input
                v-model="messageTemplateInfo.name"
                :class="{ 'is-invalid': errors.name }"
                class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
          <div class="form-group row !hidden">
            <label
              class="col-lg-12 col-form-label text-gray-900 dark:text-gray-200"
              >Заглавие (тема)</label
            >
            <div class="col-lg-12">
              <input
                v-model="messageTemplateInfo.subject"
                :class="{ 'is-invalid': errors.subject }"
                class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-lg-12 col-form-label text-gray-700 dark:text-gray-200"
            >
              Картинка/Видео
            </label>
            <div class="col-lg-12">
              <!-- Files -->
              <div>
                <storage-uploader
                  v-if="!selectedFile"
                  accept-type="image/*,image/gif,video/*"
                  @uploaded="addUploadedFile"
                />

                <storage-files
                  :resources="messageTemplateInfo.files"
                  @unlinked="removeUploadedFile"
                />
              </div>
              <!-- ./ Files -->
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-lg-12 col-form-label text-gray-900 dark:text-gray-200"
            >
              Контент
            </label>
            <div class="col-lg-12">
              <Editor
                v-model="messageTemplateInfo.body"
                editor-style="height: 320px; font-size: 16px"
                :modules="editorModules"
              />
              <has-error :message="errors.body" />
            </div>
          </div>
          <div class="form-group row">
            <label
              class="col-lg-12 col-form-label text-gray-700 dark:text-gray-200"
            >
              Клиенты
            </label>
            <div class="col-lg-12">
              <reworked-multiselect
                v-model="selectedClientUsers"
                :options="clientUsers"
                :multiple="true"
                :close-on-select="false"
                :show-labels="false"
                placeholder="Выберите клиентов"
                label="name"
                track-by="name"
              >
                <template #caret>
                  <button
                    type="button"
                    class="select-all-button font-bold italic"
                    @click="toggleSelectAll"
                  >
                    {{ isAllSelected ? "Снять выбор" : "Выбрать все" }}
                  </button>
                </template>
              </reworked-multiselect>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-lg-12">
              <submit-button :submitting="submitting">
                Сохранить
              </submit-button>
            </div>
          </div>
        </form>
      </div>
      <div class="w-full md:w-1/2">
        <div class="message-preview h-full">
          <div v-if="hasPreview" class="mb-3">
            <img :src="selectedFile.links.display" style="width: 100%" />
          </div>
          <div v-if="hasVideoPreview" class="mb-3">
            <video
              :src="selectedFile.links.display"
              controls
              style="width: 100%"
            ></video>
          </div>
          <div v-html="messageTemplateInfo.body"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HasError from "@/components/HasError.vue";
import SubmitButton from "@/components/SubmitButton.vue";
import StorageUploader from "@/components/StorageUploader.vue";
import StorageFiles from "@/components/StorageFiles.vue";
import * as API from "@/services/API";
import _ from "lodash";
import Editor from "primevue/editor";
import { ReworkedMultiselect } from "@/components/reworked-multiselect";
import UserService from "@/services/UserService";

export default {
  components: {
    ReworkedMultiselect,
    StorageFiles,
    Editor,
    StorageUploader,
    SubmitButton,
    HasError,
  },
  props: {
    telegramMessageTemplate: {
      type: Object,
      default: function () {
        return {
          name: null,
          subject: null,
          body: null,
          files: [],
        };
      },
    },
  },
  emits: ["saved"],
  data: () => ({
    submitting: false,
    messageTemplateInfo: null,
    clientUsers: [],
    selectedClientUsers: [],
    selectedFile: null,
    errors: {},
    editorModules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"], // Основные текстовые стили
        ["blockquote", "code-block"], // Форматирование текста
        ["link"], // Вставка
        ["clean"], // Очистка форматирования
      ],
    },
  }),
  computed: {
    isNewRecord() {
      return !Object.prototype.hasOwnProperty.call(
        this.telegramMessageTemplate,
        "id"
      );
    },
    resourceUrl() {
      return this.isNewRecord
        ? "/telegram-message-templates"
        : "/telegram-message-templates/" + this.telegramMessageTemplate.id;
    },
    isAllSelected() {
      return this.selectedClientUsers.length === this.clientUsers.length;
    },
    hasPreview() {
      if (
        this.selectedFile &&
        this.selectedFile.mime_type.startsWith("image/")
      ) {
        return true;
      }

      return false;
    },
    hasVideoPreview() {
      if (
        this.selectedFile &&
        this.selectedFile.mime_type.startsWith("video/")
      ) {
        return true;
      }

      return false;
    },
  },
  async created() {
    this.messageTemplateInfo = this.telegramMessageTemplate;
    await this.getClientUsers();
  },
  methods: {
    addUploadedFile(attachment) {
      this.messageTemplateInfo.files.push(attachment);
      this.selectedFile = attachment;
    },
    removeUploadedFile(attachment) {
      this.messageTemplateInfo.files = this.messageTemplateInfo.files.filter(
        function (f) {
          return f.id !== attachment.id;
        }
      );
      this.selectedFile = null;
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedClientUsers = [];
      } else {
        this.selectedClientUsers = [...this.clientUsers];
      }
    },
    async getClientUsers() {
      try {
        const response = await UserService.getTelegramClientUsers(
          this.currentPage,
          {
            params: {
              page: -1,
              includes: ["empty"],
            },
          }
        );

        this.clientUsers = response.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async submit() {
      if (!this.submitting) {
        this.submitting = true;

        this.messageTemplateInfo.clientIds = this.selectedClientUsers.map(
          (item) => item.id
        );

        try {
          const response = await API.apiClient({
            method: this.isNewRecord ? "post" : "put",
            url: this.resourceUrl,
            data: _.merge(this.messageTemplateInfo, {
              files: this.messageTemplateInfo.files.map((f) => {
                return f.id;
              }),
            }),
          });

          this.$emit("saved", response.data.data);
        } catch (e) {
          this.extractValidation(e);
        }

        this.submitting = false;
      }
    },
  },
};
</script>

<style>
.message-preview {
  max-width: 340px;
  padding: 10px;
  margin: 0 auto;
  border-radius: 10px;
  border: 1px solid grey;
}

.p-editor-toolbar {
  display: none;
}
</style>

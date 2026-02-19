<template>
  <ul class="storage-files-list list-inline mb-0">
    <li v-for="file in files" :key="file.id" class="list-inline-item">
      <div class="card bg-gray-100 dark:bg-gray-500 py-1 px-3 mb-3 mt-0">
        <div class="media">
          <div class="mr-2 align-self-center">
            <image-preview-component
              v-if="isImage"
              :image-name="null"
              :image-url="file.links.display"
            >
              <template #image-name>
                <i
                  :class="
                    mimeTypeIcon(file.mime_type) +
                    ' icon-2x text-primary-400 top-0 text-indigo-500 dark:text-indigo-400'
                  "
                ></i>
              </template>
            </image-preview-component>
            <a
              v-else
              :href="file.links.display"
              class="font-bold text-indigo-500 dark:text-indigo-400"
              target="_blank"
            >
              <i
                :class="
                  mimeTypeIcon(file.mime_type) +
                  ' icon-2x text-primary-400 top-0 text-indigo-500 dark:text-indigo-400'
                "
              />
            </a>
          </div>

          <div class="!hidden media-body">
            <ul class="list-inline list-inline-condensed mb-0">
              <li class="list-inline-item">
                <div>
                  <image-preview-component
                    :image-name="$filters.truncate(file.filename, 12)"
                    :image-url="file.links.display"
                    @click="handleClick"
                  ></image-preview-component>
                </div>
              </li>
              <li v-if="showUnlinkButton" class="list-inline-item">
                <a
                  href="#"
                  class="text-red-500 dark:text-red-400 font-bold remove_file"
                  @click.prevent="unlink(file)"
                  >x</a
                >
              </li>
            </ul>
          </div>

          <div class="media-body">
            <div class="font-weight-semibold" style="word-break: break-word">
              <span>
                <image-preview-component
                  v-if="isImage"
                  :image-name="$filters.truncate(file.filename, truncateLength)"
                  :image-url="file.links.display"
                ></image-preview-component>
                <a
                  v-else
                  :href="file.links.display"
                  class="font-bold text-indigo-500 dark:text-indigo-400"
                  target="_blank"
                >
                  <span
                    class="font-bold text-indigo-500 dark:text-indigo-400 cursor-pointer"
                  >
                    <slot name="image-name">
                      {{ $filters.truncate(file.filename, truncateLength) }}
                    </slot>
                  </span>
                </a>
              </span>
            </div>

            <ul class="list-inline list-inline-condensed mb-0">
              <li v-if="showUnlinkButton" class="list-inline-item">
                <a
                  href="#"
                  class="text-red-500 dark:text-red-400 font-bold remove_file"
                  @click.prevent="unlink(file)"
                  >Удалить</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import * as API from "@/services/API";
import ImagePreviewComponent from "@/components/storage-files/ImagePreviewComponent.vue";

export default {
  components: {
    ImagePreviewComponent,
  },
  props: {
    resources: {
      type: Array,
      default: function () {
        return [];
      },
    },
    showUnlinkButton: {
      type: Boolean,
      default: true,
    },
    truncateLength: {
      type: Number,
      default: 17,
    },
  },
  emits: ["unlinked"],

  data: () => ({
    files: [],
  }),

  computed: {
    isImage() {
      return this.files[0].mime_type.includes("image");
    },
  },

  watch: {
    resources: {
      immediate: true,
      handler: function (resources) {
        this.files = resources;
      },
    },
  },

  methods: {
    mimeTypeIcon(mime) {
      let icon = "icon-file-empty";
      if (mime.startsWith("image/")) {
        icon = "icon-file-picture";
      } else if (mime === "application/pdf") {
        icon = "icon-file-pdf";
      } else if (
        mime === "application/vnd.ms-excel" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        icon = "icon-file-excel";
      } else if (
        mime === "application/msword" ||
        mime ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        icon = "icon-file-word";
      } else if (
        mime === "application/zip" ||
        mime === "application/x-rar-compressed"
      ) {
        icon = "icon-file-zip";
      }
      return icon;
    },

    unlink(file) {
      this.$emit("unlinked", file);
    },

    async saveFile(file) {
      console.log(file);
      try {
        if (file.filename) {
          const response = await API.apiClient({
            method: "put",
            url: "/storage/files/" + file.id,
            data: file,
          });
          console.log(response);
        }

        //this.$emit('save', response.data.data);
      } catch (e) {
        this.extractValidation(e);
      }
      // this.$emit('unlinked', file)
    },
  },
};
</script>

<style>
.storage-files-list {
  line-height: 125%;
}
</style>

<template>
  <ul class="storage-files-list list-inline mb-0">
    <li v-for="file in files" :key="file.id" class="list-inline-item">
      <div class="card bg-gray-100 dark:bg-gray-500 py-1 px-3 mb-3 mt-0">
        <div class="media my-1">
          <div class="mr-2 py-2 align-self-center">
            <a :href="file.links.display" target="_blank">
              <i
                :class="
                  mimeTypeIcon(file.mime_type) +
                  ' icon-2x text-primary-400 top-0 text-indigo-500 dark:text-indigo-400'
                "
              ></i>
            </a>
          </div>

          <div class="media-body">
            <div class="font-weight-semibold" style="word-break: break-word">
              <span>
                <input
                  v-model="file.filename"
                  type="text"
                  class="form-control-flush text-black dark:text-gray-200"
                  @input="saveFile(file)"
                />
              </span>
            </div>

            <ul class="list-inline list-inline-condensed mb-0">
              <li class="list-inline-item">
                <a
                  :href="file.links.display"
                  class="font-bold text-indigo-500 dark:text-indigo-400"
                  target="_blank"
                  >Просмотр</a
                >
              </li>
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

export default {
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
  },
  emits: ["unlinked"],

  data: () => ({
    files: [],
  }),

  watch: {
    resources: {
      immediate: true,
      deep: true,
      handler: function (resources) {
        this.files = [...resources];
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

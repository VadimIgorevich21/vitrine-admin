import * as API from "@/services/API";
import LoadingComponent from "@/components/LoadingComponent.vue";

export default {
  components: { LoadingComponent },
  props: {
    acceptType: {
      type: String,
      default: "*/*",
    },
  },
  data() {
    return {
      uploading: false,
    };
  },

  methods: {
    async upload(event) {
      this.uploading = true;

      for (const file of event.target.files) {
        await this.sendRequest(file);
      }

      this.uploading = false;
      // clear input
      this.$refs.file.value = "";
    },

    async sendRequest(file) {
      try {
        let formData = new FormData();
        formData.append("file", file);
        const response = await API.apiClient.post("/storage/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.$emit("uploaded", response.data.data);
      } catch (error) {
        let message;

        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 422) {
            message = error.response.data.errors.file;
          } else {
            message = error.response.data.message;
          }
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          message = "Не удалось отправить файл.";
        } else {
          // Something happened in setting up the request that triggered an Error
          message = error.message;
        }

        this.$notify("Ошибка загрузки", message, "danger");
      }
    },
  },
};

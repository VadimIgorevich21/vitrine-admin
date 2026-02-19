<template>
  <div class="form-group row">
    <label
      class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
    >
      {{ title }}
    </label>
    <div class="col-lg-6">
      <multiselect
        v-if="!loading"
        v-model="issetUsers"
        :options="availableUsers"
        :multiple="true"
        placeholder="Добавьте пользователя"
        label="name"
        track-by="id"
      ></multiselect>
    </div>
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import UserService from "@/services/UserService";

export default {
  components: {
    Multiselect,
  },
  props: {
    type: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: "Пользователи",
    },
  },
  emits: ["usersSelected"],
  data: () => ({
    loading: false,
    isShow: false,
    availableUsers: [],
    selectedUsers: [],
    issetUsers: [],
  }),
  watch: {
    issetUsers() {
      this.$emit("usersSelected", this.issetUsers);
    },
  },
  async created() {
    await this.getUsers();
  },
  methods: {
    async getUsers() {
      try {
        const response = await UserService.getUsers("-1", {
          params: {
            type: this.type,
            includes: ["roles"],
          },
        });

        this.availableUsers = response.data.data;
      } catch (e) {
        if (e.response) {
          if (e.response.status === 404) {
            this.availableUsers = null;
          }
        }
      }
    },
  },
};
</script>

<template>
  <wrapper-component>
    <template #title>
      {{ title }}
    </template>

    <user-form v-if="user" :user="user" @save="userSaved" />
  </wrapper-component>
</template>

<script>
import UserForm from "./partial/FormComponent.vue";
import WrapperComponent from "../../components/WrapperComponent.vue";
import UserService from "@/services/UserService";

export default {
  components: { WrapperComponent, UserForm },

  data: () => ({
    loading: false,
    user: null,
  }),

  computed: {
    title() {
      return this.user ? this.user.name : "...";
    },
  },

  async created() {
    await this.getUser();
  },

  methods: {
    async getUser() {
      this.loading = true;

      const response = await UserService.getUserById(this.$route.params.id, {
        params: {
          includes: ["roles", "contacts"],
        },
      });

      this.user = response.data.data;

      this.loading = false;
    },

    async userSaved() {
      await this.$router.push({
        name: "users.index",
      });
    },
  },
};
</script>

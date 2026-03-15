<template>
  <wrapper-component>
    <template #title> Новый пользователь </template>

    <user-form @save="userSaved" />
  </wrapper-component>
</template>

<script>
import WrapperComponent from "../../components/WrapperComponent.vue";
import UserForm from "./partial/FormComponent.vue";

export default {
  components: { WrapperComponent, UserForm },

  methods: {
    async userSaved() {
      await this.$router.push({
        name: "users.index",
      });
    },
  },
};
</script>

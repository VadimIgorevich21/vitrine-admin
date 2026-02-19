<template>
  <div></div>
</template>

<script>
import { useAuth } from "../../stores/authStore";

export default {
  setup() {
    const authStore = useAuth();

    return {
      authStore: authStore,
    };
  },
  created() {
    this.customLogout();
  },
  methods: {
    customLogout() {
      this.authStore.setToLogout();
      this.authStore.logout();

      this.$router.push({
        name: "Login",
      });
    },
  },
};
</script>

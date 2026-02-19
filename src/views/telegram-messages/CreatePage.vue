<template>
  <wrapper-adaptive-component class="px-0 md:px-6">
    <template #title> Отправить сообщение клиентам </template>
    <template #header-elements>
      <button class="btn btn-white" @click="$router.back()">Вернуться</button>
    </template>

    <telegram-message-template-form @saved="formSaved" />
  </wrapper-adaptive-component>
</template>

<script>
import WrapperAdaptiveComponent from "@/components/WrapperAdaptiveComponent.vue";
import TelegramMessageTemplateForm from "./partial/FormComponent.vue";

export default {
  components: { TelegramMessageTemplateForm, WrapperAdaptiveComponent },
  methods: {
    async formSaved(customer) {
      await this.$router.push({
        name: "client-customer-accesses.index",
        query: {
          type: customer.type,
        },
      });
    },
  },
};
</script>

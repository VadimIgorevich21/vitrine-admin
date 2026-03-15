<template>
  <wrapper-component>
    <template #title>
      {{ title }}
    </template>

    <order-form v-if="order" :order="order" @save="orderSaved" />
  </wrapper-component>
</template>

<script>
import OrderForm from "./partial/FormComponent.vue";
import WrapperComponent from "../../components/WrapperComponent.vue";
import OrderService from "@/services/OrderService";

export default {
  components: { WrapperComponent, OrderForm },

  data: () => ({
    loading: false,
    order: null,
  }),

  computed: {
    title() {
      return this.order ? this.order.name : "...";
    },
  },

  async created() {
    await this.getOrder();
  },

  methods: {
    async getOrder() {
      this.loading = true;

      const response = await OrderService.getOrderById(this.$route.params.id);

      this.order = response.data.data;

      this.loading = false;
    },

    async orderSaved() {
      await this.$router.push({
        name: "orders.index",
      });
    },
  },
};
</script>

<template>
  <span ref="tooltipButton" @click="showTooltip">
    <span class="cursor-pointer text-blue-600">
      <span class="fe fe-info"></span>
    </span>
  </span>
  <div v-if="visible" ref="tooltipContainer">
    <div class="tooltip-content shadow-md tooltip-el z-10">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["show"],
  data: () => ({
    visible: false,
  }),
  created() {
    window.addEventListener("click", this.toggleTooltip);
  },
  unmounted() {
    window.removeEventListener("click", this.toggleTooltip);
  },
  methods: {
    async showTooltip() {
      this.visible = !this.visible;
      if (this.visible) {
        await this.$emit("show");
      }
    },
    toggleTooltip(event) {
      if (
        !this.$refs.tooltipButton.contains(event.target) &&
        !this.$refs.tooltipContainer?.contains(event.target)
      ) {
        this.visible = false;
      }
    },
  },
};
</script>

<style scoped>
.tooltip-container {
  position: relative;
}
.tooltip-content {
  position: absolute;
  background-color: #fff;
  color: #000;
  border-radius: 0.25rem;
  width: auto;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 5px 10px;
}
</style>

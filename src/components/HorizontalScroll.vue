<template>
  <div class="scroll-container">
    <div
      v-if="showLeftArrow"
      class="scroll-arrow left-arrow"
      @click="scrollLeft"
    >
      &#9664;
    </div>
    <div ref="scrollContent" class="scroll-content" @scroll="updateArrows">
      <!-- Your scrollable content here -->
      <slot></slot>
    </div>
    <div
      v-if="showRightArrow"
      class="scroll-arrow right-arrow"
      @click="scrollRight"
    >
      &#9654;
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLeftArrow: false,
      showRightArrow: false,
    };
  },
  mounted() {
    this.updateArrows();
    window.addEventListener("resize", this.updateArrows);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.updateArrows);
  },
  methods: {
    updateArrows() {
      const scrollContent = this.$refs.scrollContent;
      const isOverflowing =
        scrollContent.scrollWidth > scrollContent.clientWidth;

      this.showLeftArrow = scrollContent.scrollLeft > 0;
      this.showRightArrow =
        scrollContent.scrollLeft + scrollContent.clientWidth <
        scrollContent.scrollWidth;

      // Show arrows only if content is overflowing
      if (!isOverflowing) {
        this.showLeftArrow = false;
        this.showRightArrow = false;
      }
    },
    scrollLeft() {
      this.$refs.scrollContent.scrollBy({ left: -100, behavior: "smooth" });
      this.updateArrows();
    },
    scrollRight() {
      this.$refs.scrollContent.scrollBy({ left: 100, behavior: "smooth" });
      this.updateArrows();
    },
  },
};
</script>

<style scoped>
.scroll-container {
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.scroll-content {
  overflow-x: auto;
  white-space: nowrap;
  scroll-behavior: smooth;
  flex-grow: 1;
}

.scroll-arrow {
  cursor: pointer;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.left-arrow {
  left: 0;
}

.right-arrow {
  right: 0;
}
</style>

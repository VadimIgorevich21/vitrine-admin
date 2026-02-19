<template>
  <div
    ref="scrollTopButton"
    class="sticky w-full flex justify-end bottom-0 pb-3 pr-5 lg:pr-16 transition"
  >
    <div class="text-gray-400 hover:text-blue-400 transition">
      <button
        role="button"
        aria-label="scroll to top of the page"
        @click="scrollToTop"
      >
        <i class="text-5xl ri-arrow-up-circle-line"></i>123dsg
      </button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScrollTopButton",
  data() {
    return {
      handleDebouncedScroll: null,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
    // this.handleDebouncedScroll = debounce(this.handleScroll, 100);
    // window.addEventListener("scroll", this.handleDebouncedScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    // window.removeEventListener("scroll", this.handleDebouncedScroll);
  },

  methods: {
    handleScroll() {
      const scrollBtn = this.$refs.scrollTopButton;

      if (window.scrollY > 0) {
        scrollBtn.classList.remove("invisible");
      } else {
        scrollBtn.classList.add("invisible");
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
});
</script>

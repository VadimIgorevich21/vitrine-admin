<template>
  <div class="accordion-container">
    <div
      class="accordion-container-header w-full flex text-left"
      :class="headerClass"
    >
      <div class="w-full inline-block">
        <div
          class="inline-block cursor-pointer"
          :aria-expanded="isOpen"
          :aria-controls="`collapse${_.uid}`"
          @click.stop="toggleAccordion()"
        >
          <slot name="header-title" />
        </div>
        <div class="inline-block ml-1">
          <slot name="header-additional-info"></slot>
        </div>
      </div>
      <div
        v-if="isOpen"
        class="accordion-container-header-close inline-block float-right cursor-pointer"
        @click.stop="isOpen = false"
      >
        <slot name="header-close"></slot>
      </div>
    </div>

    <transition>
      <div
        v-show="isOpen"
        :id="`collapse${_.uid}`"
        class="accordion-container-content"
        :class="contentClass"
      >
        <slot name="content" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "ToggleAccordionComponent",
  props: {
    isDefaultOpened: {
      type: Boolean,
      default: false,
    },
    isTitleOnlyOpen: {
      type: Boolean,
      default: false,
    },
    headerClass: {
      type: String,
      default: null,
    },
    contentClass: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },

  mounted() {
    this.isOpen = this.isDefaultOpened;
  },

  methods: {
    toggleAccordion() {
      if (this.isTitleOnlyOpen === true) {
        this.isOpen = true;
      } else {
        this.isOpen = !this.isOpen;
      }
    },
  },
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

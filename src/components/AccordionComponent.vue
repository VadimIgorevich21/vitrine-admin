<template>
  <div>
    <button
      class="operation-preview-block-head p-2 px-4 bg-gray-100 w-full flex text-left hover:bg-gray-200 font-bold"
      :aria-expanded="isOpen"
      :aria-controls="`collapse${_.uid}`"
      :class="{
        'bg-gray-200  dark:bg-gray-700': isOpen,
        'bg-transparent': !isOpen,
      }"
      @click.stop="toggleAccordion()"
    >
      <slot name="icon"></slot>
      <span class="w-full">
        <slot name="title" />
      </span>
      <span
        class="box-border mt-1 text-gray-500 dark:text-gray-500"
        :class="{
          'rotate-180': isOpen,
          'rotate-0': !isOpen,
        }"
      >
        <span class="float-right">
          <Icon icon="fa6-solid:angle-down" />
        </span>
      </span>
    </button>

    <div
      v-show="isOpen"
      :id="`collapse${_.uid}`"
      class="dark:bg-gray-900 bg-gray-50 rounded-md mt-2 p-2"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
export default {
  name: "AccordionComponent",
  components: {
    Icon,
  },
  data() {
    return {
      isOpen: false,
    };
  },

  methods: {
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

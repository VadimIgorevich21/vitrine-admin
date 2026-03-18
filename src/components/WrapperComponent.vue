<template>
  <div class="main-content px-4 py-6 md:px-8 md:py-8">
    <div v-if="showHeader" class="mb-8">
      <div class="container-fluid p-0">
        <div
          class="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div class="relative">
            <h1
              v-if="!!$slots['title']"
              class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
            >
              <slot name="title" />
              <span
                v-if="!!$slots['subtitle']"
                class="text-slate-400 font-medium ml-2"
              >
                / <slot name="subtitle"
              /></span>
            </h1>
            <div class="h-1 w-12 bg-indigo-600 rounded-full mt-2"></div>
          </div>
          <div
            v-if="!!$slots['header-elements']"
            class="flex items-center gap-3 sm:flex-row flex-col"
          >
            <slot name="header-elements" />
          </div>
        </div>
        <div v-if="!!$slots['header-content']" class="mt-6">
          <slot name="header-content" />
        </div>
        <div
          v-if="!!$slots['header-footer']"
          class="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4"
        >
          <slot name="header-footer" />
        </div>
      </div>
    </div>
    <div class="container-fluid p-0">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<template>
  <div class="main-content">
    <div v-if="showHeader" class="header-adaptive mb-3">
      <div class="px-2 md:px-3">
        <div class="header-body">
          <div class="flex justify-between flex-row">
            <div class="mt-5 w-full">
              <h1
                v-if="!!$slots['title']"
                class="lg:text-2xl text-gray-900 dark:text-gray-200 font-bold"
              >
                <slot name="title" />
                <span v-if="!!$slots['subtitle']">
                  / <slot name="subtitle"
                /></span>
              </h1>
            </div>
            <div
              v-if="!!$slots['header-elements']"
              class="mt-5 w-full flex justify-end flex-row"
            >
              <slot name="header-elements" />
            </div>
          </div>
          <!-- / .row -->
          <slot name="header-content" />
        </div>
        <!-- / .header-body -->

        <div v-if="!!$slots['header-footer']" class="header-footer">
          <slot name="header-footer" />
        </div>
      </div>
    </div>
    <!-- / .header -->
    <div class="px-0 md:p-3">
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

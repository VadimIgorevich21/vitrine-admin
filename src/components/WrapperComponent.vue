<template>
  <div class="main-content p-4 pl-6 pr-6">
    <div v-if="showHeader" class="header">
      <div class="container-fluid">
        <div class="header-body">
          <div class="flex justify-between sm:flex-row flex-col">
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
              class="mt-5 w-full flex justify-end sm:flex-row flex-col"
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
    <div class="container-fluid container-for-main-content">
      <slot />
    </div>
  </div>
  <!-- / .main-content -->
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

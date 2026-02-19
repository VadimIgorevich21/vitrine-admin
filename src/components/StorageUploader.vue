<template>
  <button
    type="button"
    class="btn-upload bg-gray-100 dark:bg-gray-500 rounded-md py-2 px-4 cursor-pointer text-gray-700 dark:text-gray-200 flex flex-row justify-start items-center"
    :disabled="uploading"
  >
    <i v-if="!uploading" class="icon-attachment mr-2" />
    <loading-component
      v-else
      class="mr-2 !mt-0 !w-[24px] !h-[24px]"
      :enabled="true"
    />
    <span>Загрузить</span>
    <input
      ref="file"
      :accept="acceptType"
      type="file"
      multiple
      @change="upload"
    />
  </button>
</template>

<script src="./storage-uploader.js"></script>

<style type="text/scss" scoped>
.btn-upload {
  position: relative;
}

.btn-upload input[type="file"] {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;
  width: 100%;
}
</style>

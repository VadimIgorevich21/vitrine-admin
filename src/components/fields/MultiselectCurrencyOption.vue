<template>
  <div class="flex flex-row justify-start items-center">
    <div
      v-if="!slotProps.option.img_url"
      class="relative !h-[14.28px] !w-[20px] mr-1 rounded-sm border border-solid border-[#00113326] combobox-item-icon"
    ></div>
    <img
      v-else
      class="mr-1"
      alt="Currency"
      :src="getUrl(slotProps.option)"
      width="20"
      height="20"
    />
    <div>
      {{ slotProps.option.code }} -
      <span class="text-gray-500">{{ slotProps.option.title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    slotProps: {
      type: Object,
      default: null,
    },
    field: {
      type: String,
      default: "fullName",
    },
  },
  methods: {
    getUrl(item) {
      return "/" + item.img_url;
    },
  },
};
</script>

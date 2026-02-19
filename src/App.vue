<template>
  <notifications group="default" position="bottom right" />
  <notifications group="cashbox-currencies" position="bottom right" />
  <notifications group="auth" position="bottom right" />
  <notifications group="operations" position="bottom right">
    <template #body="props">
      <div
        class="vue-notification-template"
        :class="props.item.type ?? 'vue-notification'"
      >
        <div class="row items-center">
          <div class="col-10">
            <div class="notification-title">{{ props.item.title }}</div>
          </div>
          <div class="col-2 text-right">
            <button class="close" @click="props.close">
              <i class="fa fa-fw fa-close"></i>x
            </button>
          </div>
          <div v-if="props.item.data.canCopy" class="col-12 mt-2 mb-2">
            <button type="button" @click="doCopy(props.item.text)">
              <span class="font-size-16 text-yellow-300"
                ><i class="fe fe-copy mr-2"></i> Копировать</span
              >
            </button>
          </div>
        </div>
        <div
          ref="operation-manager-info"
          class="notification-content"
          v-html="getSliceText(props.item.text)"
        />
      </div>
    </template>
  </notifications>
  <div id="scroll-top-button" class="invisible bottom-0 transition">
    <i class="fe fe-chevrons-up"></i>
  </div>
  <component :is="layout">
    <router-view :key="viewKey" />
  </component>
</template>
<script lang="ts" setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { copyText } from "vue3-clipboard";
import { notify } from "@kyvg/vue3-notification";

const defaultLayout = "empty";

const { currentRoute } = useRouter();

const layout = computed(
  () => `${currentRoute.value.meta.layout || defaultLayout}-layout`
);

const viewKey = computed(() => {
  const route = currentRoute.value;

  // Если стоит meta.noQueryRecreate → НЕ пересоздаём компонент
  if (route.meta.noQueryRecreate) {
    // Значит пересоздаём компонент только когда меняется id
    return route.params.id || route.name;
  }

  // Иначе работаем "как раньше"
  return route.fullPath;
});

const doCopy = (string) => {
  let message = string.replace(/<br ?\/?>/g, "\n");
  copyText(message, undefined, (error) => {
    if (error) {
      console.log(error);
    } else {
      notify({
        group: "operations",
        // classes: "vue-notification-template vue-notification success",
        type: "vue-notification success",
        duration: 3000,
        title: "Info",
        text: "Скопировано",
      });
    }
  });
};

const getSliceText = (string, symbolsCount = 100) => {
  return string.length > symbolsCount
    ? string.slice(0, symbolsCount - 3) + "..."
    : string;
};
onMounted(async () => {
  localStorage.removeItem("configs");
  localStorage.removeItem("user");
});
</script>

<style>
#scroll-top-button {
  position: fixed;
  bottom: 15px;
  right: 34px;
  background: rgb(119, 119, 119);
  border-radius: 150px;
  width: 45px;
  height: 45px;
  text-align: center;
  cursor: pointer;
  z-index: 10000;
  font-size: 30px;
  color: #fff;
}

.vue-universal-modal {
  z-index: 1000;
}
</style>

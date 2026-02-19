<template>
  <div
    v-if="!!$slots['dropdown-items']"
    class="dropdown-dots-menu text-gray-500 dark:text-gray-400"
  >
    <div class="text-right">
      <button ref="button" @click="open">
        <i data-v-cd3d47b4="" class="fe fe-more-vertical"></i>
      </button>
    </div>
    <transition name="fade" appear>
      <div
        v-show="isOpen"
        ref="itemsContainer"
        class="sub-menu bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        :class="{ top: isBottom }"
        style="position: fixed; z-index: 10000"
      >
        <slot name="dropdown-items" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "DropdownDotsPinkComponent",
  props: {
    isBottom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  created() {
    window.addEventListener("click", (e) => {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    });
    window.addEventListener("resize", () => {
      this.isOpen = false;
    });
  },
  methods: {
    open(event) {
      let rect = this.$refs.button.getBoundingClientRect();
      this.$refs.itemsContainer.style.top =
        event.pageY + Math.abs(event.layerY) + "px";
      if (event.clientY > window.outerHeight - 150) {
        this.$refs.itemsContainer.style.top =
          event.pageY + Math.abs(event.layerY) - 100 + "px";
      }
      this.$refs.itemsContainer.style.right = window.innerWidth - rect.x + "px";
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style>
.dropdown-dots-menu svg {
  width: 10px;
  margin-left: 10px;
}

.dropdown-dots-menu {
  position: relative;
}

.dropdown-dots-menu > a {
  text-align: right;
}

.dropdown-dots-menu .sub-menu {
  width: max-content;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  float: left;
  min-width: 10rem;
  padding: 0 5px;
  padding: 0;
  padding: 0.5rem 0;
  margin: 0 0 0;
  font-size: 0.9375rem;
  list-style: none;
  background-clip: padding-box;
  border: 1px solid rgba(18, 38, 63, 0.1);
  border-radius: 0;
  background: rgb(254, 242, 243);

  background-color: rgb(255, 255, 255);
  color: rgb(38, 38, 38);
  transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  border-radius: 4px;
  outline: 0px;
  box-shadow: rgba(0, 0, 0, 0.08) 0px 1px 4px;
}

.dropdown-dots-item {
  display: block;
  width: 100%;
  padding: 0.5rem 1.5rem;
  clear: both;
  font-weight: 400;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  //border-bottom: 1px solid rgb(220, 208, 209);
  color: rgb(70, 58, 59);
  color: rgb(38, 38, 38);
}

.dropdown-dots-item:hover {
  background: rgb(253, 230, 232);
  background: rgba(0, 0, 0, 0.04);
}

.dropdown-dots-item:last-child {
  border: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.top {
  top: -400% !important;
}

.dropdown-dots-item.disabled-link:hover,
.dropdown-dots-item.disabled-link.text-danger:hover,
.dropdown-dots-item.disabled-link {
  cursor: default;
  //background-color: #c0c0c0 !important;
  color: gray !important;
}
</style>

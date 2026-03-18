<template>
  <div>
    <!-- App Container -->
    <div
      class="flex h-screen bg-packed font-lexend dark:bg-gray-950 overflow-hidden transition-colors duration-300"
    >
      <!-- Sidebar Container -->
      <div
        id="sidebar-scroll"
        class="flex-sidebar lg:w-sidebar w-[280px] lg:static fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-900 shadow-xl lg:shadow-none transition-transform duration-300 transform lg:translate-x-0"
        :class="{
          '-translate-x-full': !sidebarVisible,
          'translate-x-0': sidebarVisible,
        }"
      >
        <SidebarComponent @close="sidebarVisible = false" />
      </div>

      <!-- Main Content -->
      <div
        id="body-scroll"
        class="flex-auto relative w-full overflow-y-auto h-full flex flex-col"
      >
        <!-- Mobile Header / Toggle -->
        <div
          class="lg:hidden flex items-center p-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30"
        >
          <button
            class="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
            @click="sidebarVisible = true"
          >
            <Icon icon="heroicons:bars-3-bottom-left" class="w-6 h-6" />
          </button>
          <span class="!hidden ml-4 font-bold text-gray-800 dark:text-gray-200"
            >Admin</span
          >
        </div>

        <!-- Scrollable Content Area -->
        <div class="flex-grow">
          <slot />
        </div>

        <FooterComponent />
      </div>

      <!-- Mobile Overlay -->
      <div
        v-if="sidebarVisible"
        class="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        @click="sidebarVisible = false"
      ></div>
    </div>
  </div>
</template>

<script>
import SidebarComponent from "../partials/SidebarComponent.vue";
import FooterComponent from "../partials/FooterComponent.vue";
import { Icon } from "@iconify/vue";

export default {
  name: "App",

  components: {
    FooterComponent,
    SidebarComponent,
    Icon,
  },
  data() {
    return {
      sidebarVisible: false,
    };
  },
  watch: {
    $route() {
      // Close sidebar on mobile when route changes
      this.sidebarVisible = false;
    },
  },
  mounted() {
    // const scrollbar = Scrollbar.init(document.querySelector("#body-scroll"));

    setTimeout(() => {
      var alert_dis = document.querySelectorAll(".alert-dismiss");
      alert_dis.forEach((x) =>
        x.addEventListener("click", function () {
          x.parentElement.classList.add("hidden");
        })
      );
    }, 100);

    //SCROlLTOP
    // scrollbar.addListener(function (event) {
    //   // const scrollBtn = this.$refs.scrollTopButton;
    //   const scrollBtn = document.querySelector("#scroll-top-button");
    //
    //   if (scrollbar.scrollTop > 0) {
    //     scrollBtn.classList.remove("invisible");
    //   } else {
    //     scrollBtn.classList.add("invisible");
    //   }
    //
    //   scrollBtn.addEventListener("click", function () {
    //     // x.parentElement.classList.add("hidden");
    //     scrollbar.scrollTo(0, 0, 1000);
    //   });
    // });
    //
    // scrollbar.addListener((status) => {
    //   const offset = window.offsetWidth;
    //   console.log(offset);
    //   const scrollBtn = document.querySelector("#scroll-top-button");
    //   scrollBtn.style.top = offset + "px";
    // });
    //SCROlLTOP

    // var acc = document.getElementsByClassName("accordion");
    // var i;
    // for (i = 0; i < acc.length; i++) {
    //   acc[i].addEventListener("click", function () {
    //     this.classList.toggle("active");
    //     var panel = this.nextElementSibling;
    //     if (panel.style.display === "block") {
    //       panel.style.display = "none";
    //       this.classList.remove("bg-gray-100");
    //       this.classList.add("bg-transparent");
    //     } else {
    //       panel.style.display = "block";
    //       this.classList.add("bg-gray-100");
    //       this.classList.remove("bg-transparent");
    //     }
    //   });
    // }

    const content = document.getElementById("body-scroll");
    content.addEventListener("scroll", this.handleScroll);
    const scrollBtn = document.getElementById("scroll-top-button");
    scrollBtn.addEventListener("click", this.scrollToTop);
    this.handleScroll(); // Initial check
  },
  methods: {
    handleScroll() {
      const scrollBtn = document.getElementById("scroll-top-button");
      const content = document.getElementById("body-scroll");

      if (content.scrollTop > 0) {
        scrollBtn.classList.remove("invisible");
      } else {
        scrollBtn.classList.add("invisible");
      }
    },
    scrollToTop() {
      const content = document.getElementById("body-scroll");
      content.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style>
@media (max-width: 640px) {
  .pb-50px {
    padding-bottom: 50px;
  }
}
</style>

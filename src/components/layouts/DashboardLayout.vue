<template>
  <div>
    <!-- App -->
    <div class="flex bg-packed font-lexend dark:bg-gray-900 items-center">
      <div
        id="sidebar-scroll"
        class="flex-sidebar lg:flex-auto w-sidebar lg:block hidden bg-white dark:bg-gray-800 border-r-2 dark:border-gray-700 h-screen lg:z-0 z-40 overflow-auto lg:relative fixed"
      >
        <SidebarComponent />
      </div>
      <div
        id="body-scroll"
        class="flex-auto w-full overflow-auto h-screen pb-50px"
      >
        <HeaderComponent />
        <div id="mobile-for-header"></div>
        <slot />
        <FooterComponent />
      </div>
    </div>
  </div>
  <!-- end app -->
</template>

<script>
import SidebarComponent from "../partials/SidebarComponent.vue";
import HeaderComponent from "../partials/HeaderComponent.vue";
import FooterComponent from "../partials/FooterComponent.vue";

export default {
  name: "App",

  components: {
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
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

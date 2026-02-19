export const ContextMenuHelper = {
  data: () => ({
    startPosition: null,
  }),
  methods: {
    setStartPosition() {
      let initContainer = document.getElementById("context-menu");
      initContainer.classList.remove("shadow");
      initContainer.classList.remove("border-b-2");
      initContainer.classList.remove("context-menu-sticky");

      let container = document
        .getElementById("context-menu")
        .getBoundingClientRect();
      this.startPosition = container.top;
    },
    move() {
      if (document.body.offsetWidth <= 768) {
        let overlayMenu = document.getElementById("overlay_tmenu");
        let container = document.getElementById("context-menu");
        if (
          document.getElementById("body-scroll").scrollTop > this.startPosition
        ) {
          container?.classList?.add("shadow");
          container?.classList?.add("border-b-2");
          container?.classList?.add("context-menu-sticky");
        } else {
          container?.classList?.remove("shadow");
          container?.classList?.remove("border-b-2");
          container?.classList?.remove("context-menu-sticky");
        }
        if (overlayMenu) {
          overlayMenu.style.top =
            container.getBoundingClientRect().top +
            container.getBoundingClientRect().height +
            "px";
          overlayMenu.style.position = "absolute";
        }
      }
    },
    init() {
      const content = document.getElementById("body-scroll");
      content.addEventListener("scroll", this.move);
      // Scrollbar.get(document.getElementById("body-scroll")).addListener(
      //   this.move
      // );
      this.setStartPosition();
      window.addEventListener("resize", this.setStartPosition);
    },
  },
  unmounted() {
    const content = document.getElementById("body-scroll");
    content.removeEventListener("scroll", this.hide);
    // Scrollbar.get(document.getElementById("body-scroll")).removeListener(
    //   this.move
    // );
    window.removeEventListener("resize", this.setStartPosition);
  },
};

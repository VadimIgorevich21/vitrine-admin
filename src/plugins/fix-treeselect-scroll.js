import TreeSelect from "primevue/treeselect";

export default {
  install() {
    const origMounted = TreeSelect.mounted;

    TreeSelect.mounted = function (...args) {
      origMounted?.apply(this, args);

      const hiddenInput = this.$el.querySelector(".p-hidden-accessible input");

      if (hiddenInput) {
        const origFocus = hiddenInput.focus.bind(hiddenInput);
        hiddenInput.focus = (opts) =>
          origFocus({ ...(opts || {}), preventScroll: true });
      }
    };
  },
};

export default {
  mounted(el, binding) {
    el.style.position = "relative";

    const tooltip = document.createElement("div");
    tooltip.className =
      "absolute bg-white text-black p-2 rounded shadow-md tooltip-el";
    tooltip.textContent = binding.value || "Default Tooltip Content";
    tooltip.style.display = "none";
    tooltip.style.width = "max-content";
    tooltip.style.border = "1px solid white";
    tooltip.style["z-index"] = "9999999";
    tooltip.style["font-size"] = "14px";
    tooltip.style["border-radius"] = "5";
    tooltip.style["box-shadow"] = "0px 5px 10px rgba(0, 0, 0, 0.7)";
    tooltip.style["font-size"] = "14px";
    tooltip.style.padding = "2px 10px";

    el.appendChild(tooltip);

    const showTooltip = () => {
      for (const el of document.getElementsByClassName("tooltip-el")) {
        el.style.display = "none";
      }
      tooltip.style.display = "block";
    };

    const hideTooltip = () => {
      tooltip.style.display = "none";
    };

    el.addEventListener("click", () => {
      tooltip.style.display === "block" ? hideTooltip() : showTooltip();
    });

    document.addEventListener("click", (event) => {
      if (!el.contains(event.target)) {
        hideTooltip();
      }
    });
  },
};

<template>
  <input
    type="text"
    :value="displayValue"
    placeholder="0"
    @input="validateInput"
    @paste="onPaste"
  />
</template>

<script>
export default {
  props: {
    // eslint-disable-next-line vue/require-prop-types
    modelValue: {
      default: null,
    },
    maxValue: {
      default: 100000000,
      type: Number,
    },
    minValue: {
      default: 0,
      type: Number,
    },
    decimalPlaces: {
      default: 2,
      type: Number,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      oldValue: "",
      inputValue: "",
      displayValue: "",
      isValid: true,
      errorMessage: "",
    };
  },
  watch: {
    modelValue: {
      immediate: true,
      handler(value) {
        if (!value) {
          value = "";
        }
        const normalizedValue = value
          .toString()
          .replace(",", ".")
          .replace(/\s/g, "");
        let validChars = null;
        if (this.minValue < 0) {
          validChars = /^-?(\d+(\.\d{0,100})?)?$/;
        } else {
          validChars = /^(\d+(\.\d{0,100})?)?$/;
        }
        if (!validChars.test(normalizedValue)) {
          this.inputValue = "0";
          this.oldValue = this.inputValue;
          this.updateDisplayValue();
          return;
          // throw new Error("model value is not valid!");
        }

        this.inputValue = normalizedValue;
        this.oldValue = this.inputValue;
        this.updateDisplayValue();
      },
    },
  },
  methods: {
    validateInput(event) {
      const value = event.target.value;
      const normalizedValue = value.replace(",", ".").replace(/\s/g, "");
      let validChars = null;
      if (this.minValue < 0) {
        validChars = new RegExp(
          "^-?(\\d+(\\.\\d{0," + this.decimalPlaces + "})?)?$"
        );
      } else {
        validChars = new RegExp(
          "^(\\d+(\\.\\d{0," + this.decimalPlaces + "})?)?$"
        );
      }
      if (
        !validChars.test(normalizedValue) ||
        Number(normalizedValue) < this.minValue ||
        Number(normalizedValue) > this.maxValue
      ) {
        this.isValid = false;
        this.inputValue = this.oldValue;
        this.$forceUpdate();
      } else {
        this.isValid = true;
        this.errorMessage = "";
        this.inputValue = normalizedValue;
        this.oldValue = this.inputValue;
        this.$emit("update:modelValue", this.inputValue);
      }
      this.updateDisplayValue();
    },
    updateDisplayValue() {
      if (this.inputValue === "-") {
        this.displayValue = "-";
      } else if (this.inputValue) {
        const parts = this.inputValue.split(".");
        const integerPart = parts[0].replace("-", "");
        parts[0] =
          (this.inputValue.startsWith("-") ? "-" : "") +
          parseInt(integerPart, 10).toLocaleString("ru-RU");
        this.displayValue = parts.join(".");
      } else {
        this.displayValue = "";
      }
    },
    onPaste(event) {
      event.preventDefault();
      event.stopPropagation();
      const value = event.clipboardData.getData("text");
      let normalizedValue = value.replace(",", ".").replace(/\s/g, "");
      if (normalizedValue.split(".")[0] && normalizedValue.split(".")[1]) {
        normalizedValue =
          normalizedValue.split(".")[0] +
          "." +
          normalizedValue.split(".")[1].substring(0, this.decimalPlaces);
      }
      let validChars = null;
      if (this.minValue < 0) {
        validChars = new RegExp(
          "^-?(\\d+(\\.\\d{0," + this.decimalPlaces + "})?)?$"
        );
      } else {
        validChars = new RegExp(
          "^(\\d+(\\.\\d{0," + this.decimalPlaces + "})?)?$"
        );
      }
      if (
        !validChars.test(normalizedValue) ||
        Number(normalizedValue) < this.minValue ||
        Number(normalizedValue) > this.maxValue
      ) {
        this.isValid = false;
        this.inputValue = this.oldValue;
        this.$forceUpdate();
      } else {
        this.isValid = true;
        this.errorMessage = "";
        this.inputValue = normalizedValue;
        this.oldValue = this.inputValue;
        this.$emit("update:modelValue", this.inputValue);
      }
      this.updateDisplayValue();
    },
  },
};
</script>

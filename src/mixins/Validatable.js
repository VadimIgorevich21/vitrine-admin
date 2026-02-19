export const Validatable = {
  data() {
    return {
      errors: {},
    };
  },

  methods: {
    clearErrors() {
      this.errors = {};
    },

    extractValidation(e) {
      if (e.response && e.response.status === 422) {
        this.errors = e.response.data.errors || {};
      } else {
        this.clearErrors();
      }
    },
  },
};

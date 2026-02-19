<template>
  <div class="form-group row">
    <label
      class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
      >Доступные IP</label
    >
    <div v-if="allowedIpAddresses" class="col-lg-6">
      <div
        v-for="(allowedIpAddress, index) in allowedIpAddresses"
        :key="allowedIpAddress"
      >
        <div class="form-group row">
          <div class="col-lg-7 mb-2">
            <input
              type="hidden"
              :name="'allowed_ip_addresses[' + index + ']id'"
              :value="allowedIpAddress.id"
            />
            <input
              v-model="allowedIpAddress.ip_address"
              :name="'allowed_ip_addresses[' + index + '][ip_address]'"
              :class="{
                'is-invalid':
                  errors['allowed_ip_addresses.' + index + '.ip_address'],
              }"
              class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
            />
            <has-error
              :message="errors['allowed_ip_addresses.' + index + '.ip_address']"
              :index="index"
            />
          </div>
          <div class="col-lg-5">
            <div class="row">
              <div class="col-8 pt-2">
                <div class="custom-control custom-switch">
                  <input
                    :id="'switchCommit' + componentId + index"
                    v-model="allowedIpAddress.is_allowed"
                    :value="allowedIpAddress.is_allowed === 1 ? true : false"
                    :name="'allowed_ip_addresses[' + index + '][is_allowed]'"
                    type="checkbox"
                    class="custom-control-input"
                  />
                  <label
                    class="custom-control-label text-gray-900 dark:text-gray-200"
                    :for="'switchCommit' + componentId + index"
                    >Доступно</label
                  >
                </div>
              </div>
              <div class="col-4 text-right">
                <button
                  class="btn btn-outline-danger"
                  type="button"
                  @click.prevent="removeAllowedIpAddress(index)"
                >
                  x
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <a
        href="#"
        class="mt-1 d-block btn btn-secondary add-contacts-button"
        @click.prevent="addAllowedIpAddress()"
      >
        <i class="icon-plus22 mr-1" />
        Добавить
      </a>
    </div>
  </div>
</template>

<script>
import HasError from "../HasError.vue";

export default {
  components: {
    HasError,
  },
  props: {
    issetAllowedIpAddresses: {
      type: Array,
      required: true,
    },
    errors: {
      type: Object,
      default: null,
    },
  },
  emits: ["change"],
  data() {
    return {
      allowedIpAddresses: [],
    };
  },
  computed: {
    componentId() {
      return this._.uid;
    },
  },
  watch: {
    issetAllowedIpAddresses() {
      this.setAllowedIpAddresss();
    },
    allowedIpAddresses: {
      handler: function (val) {
        this.$emit("change", val);
      },
      deep: true,
    },
  },
  mounted() {
    this.setAllowedIpAddresss();
  },
  methods: {
    setAllowedIpAddresss() {
      this.allowedIpAddresses = this.issetAllowedIpAddresses;
    },
    addAllowedIpAddress() {
      // this.allowedIpAddresses[0].value = 555
      this.allowedIpAddresses.push({ ip_address: "", is_allowed: true });
    },
    removeAllowedIpAddress(index) {
      if (confirm("Вы действительно хотите удалить данный IP?")) {
        this.allowedIpAddresses = this.allowedIpAddresses.filter(
          (c, i) => !(i === index)
        );
      }
    },
  },
};
</script>

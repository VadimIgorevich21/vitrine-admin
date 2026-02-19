<template>
  <div class="form-group row">
    <label
      class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
      >Доступные устройства</label
    >
    <div v-if="userDevices" class="col-lg-6">
      <div v-for="(userDevice, index) in userDevices" :key="userDevice">
        <div class="form-group row">
          <div class="col-lg-7 mb-2">
            <input
              type="hidden"
              :name="'user_devices[' + index + ']id'"
              :value="userDevice.id"
            />
            <input
              v-model="userDevice.device_key"
              :name="'user_devices[' + index + '][device_key]'"
              :class="{
                'is-invalid': errors['user_devices.' + index + '.device_key'],
              }"
              placeholder="Введите ключ устройства"
              class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
            />
            <has-error
              :message="errors['user_devices.' + index + '.device_key']"
              :index="index"
            />
          </div>
          <div class="col-lg-5">
            <div class="row">
              <div class="col-6 pt-2">
                <div class="custom-control custom-switch">
                  <input
                    :id="'switchCommit' + componentId + index"
                    v-model="userDevice.is_allowed"
                    :value="userDevice.is_allowed === 1 ? true : false"
                    :name="'user_devices[' + index + '][is_allowed]'"
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
              <div class="col-6 text-right">
                <button
                  v-if="userDevice.device_type"
                  class="btn btn-outline-primary mr-2"
                  @click.prevent="userDevice.visible = !userDevice.visible"
                >
                  <i class="fe fe-eye" />
                </button>
                <button
                  class="btn btn-outline-danger"
                  type="button"
                  @click.prevent="removeUserDevice(index)"
                >
                  x
                </button>
              </div>
            </div>
          </div>
          <div v-if="userDevice.visible" class="col-12">
            Тип устройства: {{ userDevice.device_type }},
            {{ userDevice.device_os }}, {{ userDevice.browser_name }}
          </div>
        </div>
        <hr />
      </div>
      <a
        href="#"
        class="mt-1 d-block btn btn-secondary add-contacts-button"
        @click.prevent="addUserDevice()"
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
    issetUserDevices: {
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
      userDevices: [],
    };
  },
  computed: {
    componentId() {
      return this._.uid;
    },
  },
  watch: {
    issetUserDevices() {
      this.setUserDevice();
    },
    userDevices: {
      handler: function (val) {
        this.$emit("change", val);
      },
      deep: true,
    },
  },
  mounted() {
    this.setUserDevice();
  },
  methods: {
    setUserDevice() {
      this.userDevices = this.issetUserDevices;
    },
    addUserDevice() {
      // this.userDevices[0].value = 555
      this.userDevices.push({ device_key: "", is_allowed: true });
    },
    removeUserDevice(index) {
      if (confirm("Вы действительно хотите удалить данный IP?")) {
        this.userDevices = this.userDevices.filter((c, i) => !(i === index));
      }
    },
  },
};
</script>

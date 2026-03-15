<template>
  <div
    class="mt-2 bg-white dark:bg-gray-800 pt-10 p-5 w-full rounded-md box-border shadow"
  >
    <form @submit.prevent="submit">
      <div class="form-group required row">
        <label
          class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
        >
          Ф.И.О
        </label>
        <div class="col-lg-6">
          <input
            v-model="orderInfo.name"
            type="text"
            :class="{ 'is-invalid': errors.name }"
            class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
          />
          <has-error :message="errors.name" />
        </div>
      </div>

      <div class="form-group required row">
        <label
          class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
        >
          Электронный адрес
        </label>
        <div class="col-lg-4">
          <input
            v-model="orderInfo.email"
            type="email"
            class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
            :class="{ 'is-invalid': errors.email }"
          />
          <has-error :message="errors.email" />
        </div>
      </div>

      <div class="form-group row">
        <label
          class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
        >
          Телефон
        </label>
        <div class="col-lg-4">
          <input
            v-model="orderInfo.phone"
            type="text"
            class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
            :class="{ 'is-invalid': errors.phone }"
          />
          <has-error :message="errors.phone" />
        </div>
      </div>
      <div class="form-group row">
        <label
          class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
        >
          Страна
        </label>
        <div class="col-lg-4">
          <div class="input-row">
            <reworked-multiselect
              v-model="country"
              class="inline-block"
              :multiple="false"
              :options="countries"
              :show-labels="false"
              :cleanable="false"
              label="name"
              track-by="id"
              placeholder="Выберите страну"
              @update:model-value="onChangeCountry"
            >
            </reworked-multiselect>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label
          class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
        >
          KYC статус
        </label>
        <div class="col-lg-4">
          <div class="input-row">
            <reworked-multiselect
              v-model="kycStatus"
              class="inline-block"
              :multiple="false"
              :options="kycStatuses"
              :show-labels="false"
              :cleanable="false"
              label="label"
              track-by="key"
              placeholder="Выберите KYC статус"
              @update:model-value="onChangeKycStatus"
            >
            </reworked-multiselect>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <div class="col-lg-9 offset-lg-3">
          <submit-button :submitting="submitting"> Сохранить </submit-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import * as API from "@/services/API";
import { pickBy, identity } from "lodash";
import { DateConverter, DaysOfWeek, Validatable } from "../../../mixins";
import { syncConfigs } from "../../../stores/syncConfigs";
import HasError from "../../../components/HasError.vue";
import SubmitButton from "../../../components/SubmitButton.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { ReworkedMultiselect } from "@/components/reworked-multiselect";

export default {
  components: {
    HasError,
    SubmitButton,
    ReworkedMultiselect,
  },
  mixins: [Validatable, DaysOfWeek, DateConverter],
  props: {
    order: {
      type: Object,
      default: function () {
        return {
          from_currency: "",
        };
      },
    },
  },
  emits: ["save"],
  setup() {
    const configStore2 = syncConfigs();
    const users = configStore2.users;
    return {
      roles: users.roles,
      kycStatuses: users.kyc_statuses,
      countries: configStore2.countries,
    };
  },

  data: () => ({
    orderInfo: null,
    isShow: false,
    loading: false,
    submitting: false,
  }),

  computed: {
    isNewRecord() {
      return !Object.prototype.hasOwnProperty.call(this.orderInfo, "id");
    },

    resourceUrl() {
      return this.isNewRecord ? "/orders" : "/orders/" + this.orderInfo.id;
    },
  },

  watch: {
    selectedRoles(values) {
      this.orderInfo.roles = this.roles.filter((r) => values.contains(r.name));
    },
  },

  created() {
    this.orderInfo = this.order;
    // this.country =
    //   this.countries.find((c) => c.id === this.user?.country_id) ?? null;
    // this.kycStatus =
    //   this.kycStatuses.find((c) => c.key === this.user?.kyc_status) ?? null;
  },

  methods: {
    async submit() {
      if (!this.submitting) {
        this.submitting = true;
        try {
          const response = await API.apiClient({
            method: this.isNewRecord ? "post" : "put",
            url: this.resourceUrl,
            data: pickBy(this.orderInfo, identity),
          });

          this.$emit("save", response.data.data);
        } catch (e) {
          this.extractValidation(e);
        }

        this.submitting = false;
      }
    },
    onChangeCountry(value) {
      this.orderInfo.country_id = value?.id ?? null;
    },
    onChangeKycStatus(value) {
      this.orderInfo.kyc_status = value?.key ?? null;
    },
    hasRoleByName(roleName) {
      if (
        this.orderInfo.roles.find(function (item) {
          return item.name == roleName;
        })
      ) {
        return true;
      }

      return false;
    },
    showModal() {
      this.isShow = true;
    },
    closeModal() {
      this.isShow = false;
    },
    hasRole(roleName) {
      return !!this.orderInfo.roles.find((role) => role.name == roleName);
    },
    userDevicesChanged(value) {
      this.orderInfo.user_devices = value;
    },
    contactsChanged(value) {
      this.orderInfo.contacts = value;
    },
  },
};
</script>

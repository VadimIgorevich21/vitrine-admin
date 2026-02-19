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
            v-model="userInfo.name"
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
            v-model="userInfo.email"
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
          Роли
        </label>
        <div class="col-lg-3">
          <div
            v-for="role in roles"
            :key="role"
            class="custom-control custom-checkbox"
            :class="{ 'is-invalid': errors.roles }"
          >
            <input
              :id="'checkboxRole' + role.name"
              v-model="userInfo.roles"
              type="checkbox"
              class="custom-control-input"
              :value="role"
            />
            <label
              class="custom-control-label text-gray-900 dark:text-gray-200"
              :for="'checkboxRole' + role.name"
            >
              {{ role.title }}
            </label>
          </div>

          <has-error :message="errors.roles" />
        </div>
      </div>
      <div class="form-group row">
        <div class="col-md-12">
          <contacts-component
            :isset-contacts="user.contacts"
            :errors="errors"
            @change="contactsChanged"
          ></contacts-component>
        </div>
      </div>
      <div class="form-group row">
        <label
          class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
        >
          Пароль
        </label>
        <div class="col-lg-4">
          <input
            v-model="userInfo.password"
            type="password"
            :class="{ 'is-invalid': errors.password }"
            class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
          />
          <small v-if="isNewRecord" class="form-text text-muted mt-1"
            >Если не указан - будет сгенерирован автоматически.</small
          >
          <has-error :message="errors.password" />
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
import ContactsComponent from "../../../components/multiple-fields/contacts/ContactsComponent.vue";

export default {
  components: {
    ContactsComponent,
    HasError,
    SubmitButton,
  },
  mixins: [Validatable, DaysOfWeek, DateConverter],
  props: {
    user: {
      type: Object,
      default: function () {
        return {
          name: "",
          email: "",
          roles: [],
          customers: [],
          contacts: [],
          password: "",
        };
      },
    },
  },
  emits: ["save", "cashDeleted"],
  setup() {
    const configStore2 = syncConfigs();
    const users = configStore2.users;
    const customers = configStore2.customers;
    return { roles: users.roles, customerTypes: customers.types };
  },

  data: () => ({
    userInfo: null,
    isShow: false,
    loading: false,
    submitting: false,
    selectedCustomers: [],
    selectedRoles: [],
    availableCashes: [],
    selected: null,
    options: ["Batman", "Robin", "Joker"],
    schedule: [],
  }),

  computed: {
    isNewRecord() {
      return !Object.prototype.hasOwnProperty.call(this.userInfo, "id");
    },

    resourceUrl() {
      return this.isNewRecord ? "/users" : "/users/" + this.userInfo.id;
    },
  },

  watch: {
    selectedRoles(values) {
      this.userInfo.roles = this.roles.filter((r) => values.contains(r.name));
    },
  },

  created() {
    this.userInfo = this.user;
    this.schedule = [];
  },

  methods: {
    async submit() {
      if (!this.submitting) {
        this.userInfo.customers = this.selectedCustomers.map(({ id }) => id);
        this.submitting = true;
        try {
          const response = await API.apiClient({
            method: this.isNewRecord ? "post" : "put",
            url: this.resourceUrl,
            data: pickBy(this.userInfo, identity),
          });

          this.$emit("save", response.data.data);
        } catch (e) {
          this.extractValidation(e);
        }

        this.submitting = false;
      }
    },
    hasRoleByName(roleName) {
      if (
        this.userInfo.roles.find(function (item) {
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
      return !!this.userInfo.roles.find((role) => role.name == roleName);
    },
    userDevicesChanged(value) {
      this.userInfo.user_devices = value;
    },
    onAddCustomers(customers) {
      this.selectedCustomers = customers;
    },
    contactsChanged(value) {
      this.userInfo.contacts = value;
    },
  },
};
</script>

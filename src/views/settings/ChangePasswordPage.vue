<template>
  <wrapper-component>
    <template #title> Изменение пароля </template>
    <div
      class="mt-2 bg-white dark:bg-gray-800 pt-10 p-5 w-full rounded-md box-border shadow"
    >
      <form @submit.prevent="submit">
        <div class="form-group required row">
          <label
            class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
          >
            Текущий пароль
          </label>
          <div class="col-lg-4">
            <input
              v-model="change.old_password"
              type="password"
              :class="{ 'is-invalid': errors.old_password }"
              class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
            />
            <has-error :message="errors.old_password" />
          </div>
        </div>
        <div class="form-group required row">
          <label
            class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
          >
            Новый пароль
          </label>
          <div class="col-lg-4">
            <input
              v-model="change.password"
              type="password"
              :class="{ 'is-invalid': errors.password }"
              class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
            />
            <has-error :message="errors.password" />
          </div>
        </div>

        <div class="form-group required row">
          <label
            class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
          >
            Подтвердите новый пароль
          </label>
          <div class="col-lg-4">
            <input
              v-model="change.password_confirmation"
              type="password"
              :class="{ 'is-invalid': errors.password_confirmation }"
              class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
            />
            <has-error :message="errors.password_confirmation" />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-lg-4 offset-lg-3">
            <submit-button :submitting="submitting">
              Изменить пароль
            </submit-button>

            <div v-if="updated" class="alert alert-success mt-3">
              <h3 class="alert-heading">Успех!</h3>

              Ваш пароль был изменен.
            </div>
          </div>
        </div>
      </form>
    </div>
  </wrapper-component>
</template>

<script>
import * as API from "@/services/API";
import { Validatable } from "../../mixins";
import WrapperComponent from "../../components/WrapperComponent.vue";
import HasError from "../../components/HasError.vue";
import SubmitButton from "../../components/SubmitButton.vue";

export default {
  components: { WrapperComponent, HasError, SubmitButton },
  mixins: [Validatable],

  data: () => ({
    change: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
    submitting: false,
    updated: false,
  }),

  methods: {
    async submit() {
      if (!this.submitting) {
        this.submitting = true;

        try {
          await API.apiClient({
            method: "post",
            url: "/settings/change-password",
            data: this.change,
          });

          this.clearErrors();
          this.change = {
            old_password: "",
            password: "",
            password_confirmation: "",
          };
          this.updated = true;
        } catch (e) {
          this.extractValidation(e);
        }

        this.submitting = false;
      }
    },
  },
};
</script>

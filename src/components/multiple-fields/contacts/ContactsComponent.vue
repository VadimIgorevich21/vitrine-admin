<template>
  <div class="form-group row">
    <label
      class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
    >
      Контакты
    </label>

    <div class="col-lg-6">
      <div
        v-for="(contact, index) in contacts"
        :key="index"
        class="form-group row"
      >
        <div class="col-lg-6">
          <input
            type="hidden"
            :name="'contacts[' + index + ']id'"
            :value="contact.id"
          />
          <contact-types-select
            v-model="contact.type"
            :value="contact.type"
            :name="'contacts[' + index + '][type]'"
          ></contact-types-select>
          <has-error
            :message="errors['contacts.' + index + '.type']"
            :index="index"
          />
        </div>
        <div class="col-lg-6">
          <div class="input-group mb-1">
            <!--                        <component :is="'contact-' + type"
                                               v-model="contact.value"
                                               :name="'contacts['+type+']['+index+'][value]'" />-->

            <template v-if="contact.type === 'phone'">
              <input
                v-model="contact.value"
                v-maska="'+38 ### ### ####'"
                type="text"
                placeholder="+38 000 000 0000"
                :name="'contacts[' + index + '][value]'"
                :class="{
                  'is-invalid': errors['contacts.' + index + '.value'],
                }"
                class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
              />
            </template>
            <template v-else-if="contact.type === 'email'">
              <input
                v-model="contact.value"
                :name="'contacts[' + index + '][value]'"
                type="email"
                :class="{
                  'is-invalid': errors['contacts.' + index + '.value'],
                }"
                class="form-control"
              />
            </template>
            <template v-else>
              <input
                v-model="contact.value"
                :name="'contacts[' + index + '][value]'"
                type="text"
                :class="{
                  'is-invalid': errors['contacts.' + index + '.value'],
                }"
                class="form-control"
              />
            </template>
            <div class="input-group-append">
              <button
                class="btn btn-outline-danger"
                type="button"
                @click.prevent="removeContact(index)"
              >
                x
              </button>
            </div>
            <has-error
              :message="errors['contacts.' + index + '.value']"
              :index="index"
            />
          </div>
        </div>
      </div>
      <a
        href="#"
        class="mt-1 d-block btn btn-secondary add-contacts-button"
        @click.prevent="addContact()"
      >
        <i class="icon-plus22 mr-1" />
        Добавить
      </a>
    </div>
  </div>
</template>

<script>
import HasError from "../../../components/HasError.vue";
import ContactTypesSelect from "./ContactTypesSelect.vue";

export default {
  components: {
    ContactTypesSelect,
    HasError,
  },
  props: {
    issetContacts: {
      type: Array,
      default: () => [],
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
      contacts: [],
    };
  },
  watch: {
    issetContacts() {
      this.setContacts();
    },
    contacts: {
      handler: function (val) {
        this.$emit("change", val);
      },
      deep: true,
    },
  },
  mounted() {
    this.setContacts();
  },
  methods: {
    setContacts() {
      this.contacts = this.issetContacts;
    },
    addContact() {
      // this.contacts[0].value = 555
      this.contacts.push({ value: "", type: "phone" });
    },
    removeContact(index) {
      this.contacts = this.contacts.filter((c, i) => !(i === index));
    },
  },
};
</script>

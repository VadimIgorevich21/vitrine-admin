<template>
  <div
    class="mt-2 bg-white dark:bg-gray-800 pt-10 p-5 w-full rounded-md box-border shadow"
  >
    <div class="operation-form-container">
      <form @submit.prevent="submit">
        <div class="row justify-center">
          <div class="col-lg-8">
            <div class="mb-5">
              <div class="font-size-20 font-bold">Детали заказа</div>
              <div class="border-2 border-gray-300 bg-gray-200 p-1">
                <div>
                  <span class="font-bold">Пользователь:</span>
                  {{ order.user.name }}
                </div>
                <div>
                  <span class="font-bold">Направление:</span>
                  {{ order.direction }}
                </div>
                <div>
                  <span class="font-bold">Сумма крипты:</span>
                  {{ cryptoAmount }}
                  {{ cryptoCurrency }}
                </div>
                <div>
                  <span class="font-bold">Сумма фиата:</span>
                  {{ fiatAmount }}
                  {{ fiatCurrency }}
                </div>
                <div>
                  <span class="font-bold">Тариф:</span>
                  {{ exchangeRate }}
                </div>
                <div>
                  <span class="font-bold">Fee:</span>
                  {{ commissionAmount }} {{ fiatCurrency }}
                </div>
              </div>
            </div>
            <div class="form-group-row row">
              <div class="col-12">
                <label
                  class="col-form-label-default block text-gray-900 dark:text-gray-200"
                  >Подтверждение перевода</label
                >
                <div class="input-row">
                  <textarea
                    v-model="orderInfo.tx_hash"
                    :disabled="orderInfo.status !== 'processing'"
                    class="form-control dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-300 border w-full block rounded-md text-gray-500 dark:text-gray-400"
                    :class="{ 'is-invalid': errors.tx_hash }"
                    type="text"
                    rows="4"
                    placeholder="Подтверждение перевода"
                  />
                  <has-error-visibility :message="errors.tx_hash" />
                </div>
              </div>
            </div>

            <div class="!hidden form-group row">
              <label
                class="col-lg-3 col-form-label text-lg-right text-gray-900 dark:text-gray-200"
              >
                Статус
              </label>
              <div class="col-lg-4">
                <div class="input-row">
                  <reworked-multiselect
                    v-model="status"
                    class="inline-block"
                    :multiple="false"
                    :options="statuses"
                    :show-labels="false"
                    :cleanable="false"
                    label="label"
                    track-by="key"
                    placeholder="Выберите статус"
                    @update:model-value="onChangeStatus"
                  >
                  </reworked-multiselect>
                </div>
              </div>
            </div>

            <div class="form-group row">
              <div class="col-lg-12">
                <submit-button
                  :disabled="!canTransferToProcessing"
                  :submitting="submitting && action === 'transferToProcessing'"
                  button-type="button"
                  class="mr-2 mb-2 text-nowrap"
                  @click="() => submit('transferToProcessing')"
                >
                  В обработку
                </submit-button>

                <submit-button
                  :disabled="!canComplete"
                  :submitting="submitting && action === 'complete'"
                  button-type="button"
                  class="mr-2 mb-2 text-nowrap"
                  @click="() => submit('complete')"
                >
                  Выполнен
                </submit-button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as API from "@/services/API";
import { pickBy, identity } from "lodash";
import { DateConverter, DaysOfWeek, Validatable } from "../../../mixins";
import { syncConfigs } from "../../../stores/syncConfigs";
import SubmitButton from "../../../components/SubmitButton.vue";
import "@vuepic/vue-datepicker/dist/main.css";
import { ReworkedMultiselect } from "@/components/reworked-multiselect";
import HasErrorVisibility from "@/components/HasErrorVisibility.vue";

export default {
  components: {
    HasErrorVisibility,
    SubmitButton,
    ReworkedMultiselect,
  },
  mixins: [Validatable, DaysOfWeek, DateConverter],
  props: {
    order: {
      type: Object,
      default: function () {
        return {
          name: "",
          email: "",
          roles: [],
          contacts: [],
          password: "",
        };
      },
    },
  },
  emits: ["save"],
  setup() {
    const configStore2 = syncConfigs();
    const orders = configStore2.orders;

    return {
      statuses: orders.statuses,
    };
  },

  data: () => ({
    orderInfo: null,
    isShow: false,
    loading: false,
    submitting: false,
    country: null,
    status: null,
    selectedCustomers: [],
    selectedRoles: [],
    availableCashes: [],
    selected: null,
    options: ["Batman", "Robin", "Joker"],
    schedule: [],
  }),

  computed: {
    isNewRecord() {
      return !Object.prototype.hasOwnProperty.call(this.orderInfo, "id");
    },

    resourceUrl() {
      return this.isNewRecord ? "/orders" : "/orders/" + this.orderInfo.id;
    },

    canTransferToProcessing() {
      return this.orderInfo.status === "paid";
    },

    canComplete() {
      return this.orderInfo.status === "processing";
    },
    cryptoAmount() {
      return this.formatAmount(this.order.crypto_amount_info);
    },
    cryptoCurrency() {
      return this.order.crypto_amount_info?.currency_code || "";
    },
    fiatAmount() {
      return this.formatAmount(this.order.fiat_amount_info);
    },
    fiatCurrency() {
      return this.order.fiat_amount_info?.currency_code || "";
    },
    exchangeRate() {
      return this.formatAmount(this.order.rate_info);
    },
    commissionAmount() {
      return this.order.commission_amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });
    },
  },

  created() {
    this.orderInfo = this.order;
    this.status =
      this.statuses.find((c) => c.value === this.order?.status) ?? null;
  },

  methods: {
    async submit(action = "save") {
      if (this.submitting) {
        return;
      }

      this.action = action;

      let payload = {
        tx_hash: this.orderInfo.tx_hash,
      };

      let resourceUrl = this.prepareResourceUrl(action);

      this.submitting = true;
      try {
        const response = await API.apiClient({
          method: this.isNewRecord ? "post" : "put",
          url: resourceUrl,
          data: payload,
        });

        this.$emit("save", response.data.data);
      } catch (e) {
        if (e?.response?.status === 409) {
          this.$emit("error", e.response.data);
        }
        this.extractValidation(e);
      }

      this.submitting = false;
      this.action = null;
    },
    prepareResourceUrl(action) {
      let url = "";
      switch (action) {
        case "transferToProcessing":
          url = "/orders/" + this.order.id + "/transfer-to-processing";
          break;
        case "complete":
          url = "/orders/" + this.order.id + "/complete";
          break;
      }

      return url;
    },
    // async submit() {
    //   if (!this.submitting) {
    //     this.submitting = true;
    //     try {
    //       const response = await API.apiClient({
    //         method: this.isNewRecord ? "post" : "put",
    //         url: this.resourceUrl,
    //         data: pickBy(this.orderInfo, identity),
    //       });
    //
    //       this.$emit("save", response.data.data);
    //     } catch (e) {
    //       this.extractValidation(e);
    //     }
    //
    //     this.submitting = false;
    //   }
    // },
    onChangeStatus(value) {
      this.orderInfo.status = value?.key ?? null;
    },
    formatAmount(info) {
      if (!info) return "0.00";
      const val =
        info.amount !== undefined && info.amount !== null
          ? info.amount
          : info.rate;
      if (val === undefined || val === null) return "0.00";

      const amountValue = typeof val === "string" ? parseFloat(val) : val;
      const precision =
        info.precision !== undefined && info.precision !== null
          ? parseInt(info.precision)
          : 2;

      // Use en-US locale for consistent number formatting (period as decimal separator)
      // while respecting the dynamic precision and removing redundant trailing zeros.
      return amountValue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: precision,
      });
    },
  },
};
</script>

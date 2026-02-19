export default class Customer {
  constructor(obj) {
    obj && Object.assign(this, obj);
  }

  get fullName() {
    if (this.type === "world_counterparty") {
      return this.short_name;
    }
    let fullName = this.name;
    if (
      ["bank", "counterparty", "newexpense", "cash_collector"].includes(
        this.type
      ) &&
      this.short_name
    ) {
      fullName = this.short_name + " (" + this.name + ")";
    }
    return fullName;
  }

  get shortOrFullName() {
    if (this.type === "world_counterparty") {
      return this.short_name ?? this.short_name;
    }
    let fullName = this.name;
    if (
      ["bank", "counterparty", "newexpense", "cash_collector"].includes(
        this.type
      ) &&
      this.short_name
    ) {
      fullName = fullName + " (" + this.short_name + ")";
    }
    return fullName;
  }

  get hasShortName() {
    return [
      "cash",
      "wallet",
      "world_balance",
      "world_counterparty",
      "bank",
      "counterparty",
      "newexpense",
      "cash_collector",
    ].includes(this.type);
  }

  get shortName() {
    return this.short_name ?? this.name;
  }
}

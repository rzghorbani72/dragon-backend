import _ from "lodash";

export const finalPriceCalculator = (price, voucherRecord = null) => {
  let minus_price = discountCalculator(price, voucherRecord);
  const discount_applied = price - minus_price;
  const tax_discount_applied =
    price - minus_price + taxCalculator(discount_applied);

  return {
    final_paid_price: tax_discount_applied,
    tax_amount: taxCalculator(discount_applied),
  };
};
export const discountCalculator = (price, voucherRecord) => {
  let minus_price = 0;
  if (voucherRecord?.type === "percent") {
    minus_price = (Number(price) * Number(voucherRecord.value)) / 100;
  } else if (voucherRecord?.type === "amount") {
    minus_price = Number(voucherRecord.value);
  }
  return minus_price;
};

export const taxCalculator = (price) => {
  return price * 0.09;
};

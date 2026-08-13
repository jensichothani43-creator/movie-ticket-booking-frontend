

export function calculateDiscount(total, discountValue, discountType) {
  const amount = Number(total) || 0;
  const value = Number(discountValue) || 0;
  const type = (discountType || "").toLowerCase();

  let discount = 0;

  if (type === "flat") {
    discount = value;
  } else if (type === "percent" || type === "percentage") {
    discount = (amount * value) / 100;
  }

  // Discount cannot be greater than total
  return Math.min(Math.max(discount, 0), amount);
}

export function calculateFinalAmount(total, discount = 0) {
  const amount = Number(total) || 0;
  const discountAmount = Number(discount) || 0;

  return Math.max(amount - discountAmount, 0);
}

export function getBestOffer(offers = [], total = 0) {
  const amount = Number(total) || 0;

  let bestOffer = null;
  let maxDiscount = 0;

  offers.forEach((offer) => {
    const discount = calculateDiscount(
      amount,
      offer.discount_value,
      offer.discount_type
    );

    if (discount > maxDiscount) {
      maxDiscount = discount;
      bestOffer = offer;
    }
  });

  return {
    offer: bestOffer,
    discount: maxDiscount,
  };
}


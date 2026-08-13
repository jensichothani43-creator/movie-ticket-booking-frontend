

import { describe, it, expect } from "vitest";

import {
  calculateDiscount,
  calculateFinalAmount,
  getBestOffer,
} from "../utils/pricing";

describe("Pricing calculations", () => {

  // Flat discount
  it("should calculate flat discount correctly", () => {
    expect(
      calculateDiscount(500, 100, "flat")
    ).toBe(100);
  });

  // Percentage discount
  it("should calculate percentage discount correctly", () => {
    expect(
      calculateDiscount(500, 20, "percent")
    ).toBe(100);
  });

  // Discount cannot exceed total
  it("should not allow discount greater than total", () => {
    expect(
      calculateDiscount(500, 600, "flat")
    ).toBe(500);
  });

  // Final amount
  it("should calculate final amount correctly", () => {
    expect(
      calculateFinalAmount(500, 100)
    ).toBe(400);
  });

  // Final amount cannot be negative
  it("should never return negative amount", () => {
    expect(
      calculateFinalAmount(500, 600)
    ).toBe(0);
  });

  // Best offer
  it("should select the offer with highest discount", () => {
    const offers = [
      {
        code: "SUM20",
        discount_type: "percent",
        discount_value: 20,
      },
      {
        code: "FLAT50",
        discount_type: "flat",
        discount_value: 50,
      },
    ];

    const result = getBestOffer(offers, 500);

    expect(result.offer.code).toBe("SUM20");
    expect(result.discount).toBe(100);
  });

});


import { createServerFn } from "@tanstack/react-start";
import { placeOrderSchema } from "./orders.schemas";
import { ORDER_URL } from "./order";

/** Retired endpoint: never store or confirm orders outside the POS. */
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async (): Promise<never> => {
    throw new Error(`Please place your order at ${ORDER_URL}. Website pickup ordering is no longer available.`);
  });
